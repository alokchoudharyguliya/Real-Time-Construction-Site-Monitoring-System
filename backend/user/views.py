from rest_framework import viewsets, permissions, decorators, response, parsers, status

from django.http import FileResponse, JsonResponse
from django.conf import settings
import subprocess
import requests
import os
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
		"""DRF ViewSet for user CRUD operations.

		- create: accepts username/email/password, sets password properly and leaves other
			fields blank/null when not provided.
		- list/retrieve/update/destroy: standard ModelViewSet actions.
		- idcard: detail route that generates an ID card PDF for the user (if data available).
		"""

		queryset = User.objects.all()
		serializer_class = UserSerializer
		permission_classes = [permissions.IsAuthenticated]

		def get_permissions(self):
				# allow anyone to create an account
				if self.action == 'create':
						return [permissions.AllowAny()]
				return super().get_permissions()

		def perform_create(self, serializer):
				# Create user and set password correctly
				password = serializer.validated_data.pop('password', None)
				user = serializer.save()
				if password:
						user.set_password(password)
						user.save()

		@decorators.action(
			detail=False,
			methods=['post'],
			permission_classes=[permissions.IsAuthenticated],
			parser_classes=[parsers.MultiPartParser, parsers.FormParser],
		)
		def profile(self, request):
			"""
			Update the authenticated user's profile.
			Accepts multipart/form-data fields:
			- avatar (file)
			- name, organization, phone, licenseNo, account_type, username, email, password (optional)
			Returns: { "user": <serialized user> }
			"""
			user = request.user
			data = request.data
			print(data)
			print(user)
			# Whitelisted fields that can be updated via this endpoint
			updatable = ['name', 'organization', 'phone', 'licenseNo', 'account_type', 'username', 'email']

			# Handle avatar upload if model has an avatar/FileField
			avatar = request.FILES.get('avatar')
			if avatar and hasattr(user, 'avatar'):
				# Save to user's FileField without committing repeatedly
				user.avatar.save(avatar.name, avatar, save=False)

			# Update simple fields
			for key in updatable:
				if key in data:
					setattr(user, key, data.get(key))

			# Optional password update
			password = data.get('password')
			if password:
				user.set_password(password)

			user.save()

			serializer = UserSerializer(user, context={'request': request})
			return response.Response({'user': serializer.data}, status=status.HTTP_200_OK)


		@decorators.action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
		def idcard(self, request, pk=None):
				"""Generate an ID card PDF for the user using xelatex.

				This is adapted from the previous implementation that fetched user data
				from a Mongo collection. Here we use the Django user model.
				"""
				try:
						user = self.get_object()

						# Try to obtain an avatar URL if the user model has one.
						avatar_url = getattr(user, 'avatar', None)
						phone = getattr(user, 'phone', '')
						license_number = getattr(user, 'licenseNo', '') or getattr(user, 'license_number', '')
						organization = getattr(user, 'organization', '')

						img_filename = f"{user.pk}_profile.jpg"
						img_latex_path = ""
						icon_path = os.path.join(settings.BASE_DIR, 'logoufu.png') if hasattr(settings, 'BASE_DIR') else 'logoufu.png'
						print("H1")

						if avatar_url:
								# download image
								resp = requests.get(avatar_url)
								if resp.status_code == 200:
										with open(img_filename, 'wb') as f:
												f.write(resp.content)
										img_latex_path = img_filename
						print("H1")
						# Minimal LaTeX template (keeps the structure flexible when image is missing)
						latex_template = r"""
		\documentclass[11pt]{article}
		\usepackage[landscape,paperwidth=102mm,paperheight=102mm,margin=3mm]{geometry}
		\usepackage[utf8]{inputenc}
		\usepackage{xcolor}
		\usepackage{graphicx}
		\usepackage{array}
		\usepackage{booktabs}
		\usepackage{ragged2e}
		\usepackage{helvet}
		\renewcommand{\familydefault}{\sfdefault}
		\pagestyle{empty}
		\begin{document}
		\centering
		\\vspace*{\\fill}
		\noindent
		\centering
		\colorbox{gray!5}{%
			\begin{minipage}[c][84mm][c]{80mm}
				\centering
				\colorbox{darkheader}{%
				\centering
					\begin{minipage}[c][10mm][c]{62mm}
						\centering
						\color{white}{\LARGE \textbf{IDENTITY CARD}}
					\end{minipage}
					\begin{minipage}[c]{15mm}
						\vspace{0mm}%
						\centering
						\fboxsep=0pt
						\colorbox{white}{\includegraphics[width=10mm,height=10mm,keepaspectratio]{%ICON%}}
					\end{minipage}
				}\\[2mm]
				\begin{minipage}[c]{79mm}
					\begin{minipage}[c]{25mm}
						\vspace{0mm}%
						\centering
						\fboxsep=0pt
						%IMG%
					\end{minipage}
					\hfill
					\begin{minipage}[c]{52mm}
						\vspace{0mm}%
						\begin{center}
						\hfill
						{\Large\textbf{\\MakeUppercase{ %NAME% \\\}}}
						\end{center}
						\begin{center}
						\hfill
						{\small
						\begin{tabular}{@{}>{\\bfseries}l@{\\hspace{1mm}}r@{}}
							License Number: & %LICENSE%\\
							Account Type: & %ROLE%\\
							Organization: & %ORG%\\
						\end{tabular}
						}
						\end{center}
					\end{minipage}
					\colorbox{lightpastelpurple}{%
						\begin{minipage}[c][4mm][c]{77mm}
							\centering
							\color{white}{\normalsize \textbf{CONTACT INFORMATION}}
						\end{minipage}
					}\\[1mm]
					{\small
					\begin{tabular}{@{}>{\\bfseries}l@{\\hspace{2mm}}l@{}}
						Email: & %EMAIL%\\
						Phone: & %PHONE%\\
					\end{tabular}
					}
				\end{minipage}
			\end{minipage}
		}
		\\vspace*{\\fill}
		\end{document}
		"""

						# Fill placeholders safely
						img_section = (f"\\colorbox{{white}}{{\\includegraphics[height=22mm,keepaspectratio]{{{img_latex_path}}}}}" if img_latex_path else "")
						latexCode = latex_template.replace('%ICON%', icon_path)
						latexCode = latexCode.replace('%IMG%', img_section)
						latexCode = latexCode.replace('%NAME%', user.name or user.username)
						latexCode = latexCode.replace('%LICENSE%', license_number)
						latexCode = latexCode.replace('%ROLE%', getattr(user, 'account_type', ''))
						latexCode = latexCode.replace('%ORG%', organization)
						latexCode = latexCode.replace('%EMAIL%', user.email or '')
						latexCode = latexCode.replace('%PHONE%', phone or '')
						print("H2")
						tex_path = f"{user.pk}_idcard.tex"
						pdf_path = f"{user.pk}_idcard.pdf"

						with open(tex_path, 'w', encoding='utf-8') as f:
								f.write(latexCode)

						try:
								subprocess.run(["xelatex", "-interaction=nonstopmode", tex_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
						except subprocess.CalledProcessError as e:
								# cleanup
								if os.path.exists(img_filename):
										os.remove(img_filename)
								if os.path.exists(tex_path):
										os.remove(tex_path)
								return JsonResponse({'error': 'Failed to generate PDF', 'details': e.stderr.decode() if hasattr(e, 'stderr') else str(e)}, status=500)

						pdf_file = open(pdf_path, 'rb')
						response_file = FileResponse(pdf_file, as_attachment=True, filename=f"{user.pk}_idcard.pdf", content_type='application/pdf')

						# cleanup
						if os.path.exists(img_filename):
								os.remove(img_filename)
						if os.path.exists(tex_path):
								os.remove(tex_path)

						return response_file

				except Exception as e:
						print(e)
						return JsonResponse({'error': str(e)}, status=500)
