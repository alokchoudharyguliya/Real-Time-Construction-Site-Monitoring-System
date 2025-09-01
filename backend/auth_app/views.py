from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.conf import settings
from django.core.files.storage import default_storage
import requests
from bson import ObjectId

from .utils import (
    get_users_collection, 
    hash_password, 
    verify_password, 
    generate_jwt_token,
    JSONEncoder
)

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
        collection = get_users_collection()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name','account_type']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'{field} is required'}, status=400)
        
        # Check if user already exists
        if collection.find_one({'email': data['email']}):
            return JsonResponse({'error': 'User with this email already exists'}, status=400)
        
        # Hash password
        hashed_password = hash_password(data['password'])
        
        # Create user document
        user_data = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password,
            # 'age': data.get('age'),
            'created_at': ObjectId().generation_time,
            'account_type':data['account_type'],
        }
        
        # Insert user
        result = collection.insert_one(user_data)
        user_id = result.inserted_id
        
        # Generate JWT token
        token = generate_jwt_token(user_id, data['email'])
        
        # Return response without password
        user_data.pop('password', None)
        user_data['_id'] = str(user_id)
        if 'created_at' in user_data and user_data['created_at']:
            user_data['created_at'] = user_data['created_at'].isoformat()
        
        return JsonResponse({
            'message': 'User created successfully',
            'user': user_data,
            'token': token
        }, status=201, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        print(data)
        collection = get_users_collection()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        # Find user by email
        user = collection.find_one({'email': data['email']})
        if not user:
            return JsonResponse({'error': 'Invalid email or password'}, status=401)
        
        # Verify password
        if not verify_password(data['password'], user['password']):
            return JsonResponse({'error': 'Invalid email or password'}, status=401)
        
        # Generate JWT token
        token = generate_jwt_token(user['_id'], user['email'])
        
        # Prepare user data without password
        user_data = {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'created_at': user.get('created_at').isoformat(),
            'account_type':user['account_type'],
            'avatar':user['avatar'],
            'phone':user['phone'],
        }
        # print(token)
        return JsonResponse({
            'message': 'Login successful',
            'user': user_data,
            'token': token
        }, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def profile(request):
    try:
        collection = get_users_collection()
        print(request.headers)
        user_id = getattr(request, 'user_id', None)
        print(request.user_id)
        print(user_id)
        print('user_id:', user_id, type(ObjectId(user_id)))
        if not user_id:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        print(user_id)
        
        user = collection.find_one({'_id': ObjectId(user_id)})
        print(user)
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Prepare user data without password
        user_data = {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            # 'age': user.get('age'),
            'account_type':user.get('account_type'),
            'permissions':user.get('permissions'),
            'created_at': user.get('created_at').isoformat(),
        }
        
        return JsonResponse({
            'user': user_data
        }, encoder=JSONEncoder)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_profile(request):
    try:
        collection = get_users_collection()
        user_id = getattr(request, 'user_id', None)

        if not user_id:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        # Handle multipart/form-data
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.POST
            files = request.FILES
        else:
            data = json.loads(request.body)
            files = {}

        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'age' in data:
            update_data['age'] = data['age']
        if 'organization' in data:
            update_data['organization'] = data['organization']
        if 'phone' in data:
            update_data['phone'] = data['phone']

        # Handle image upload to imgbb
        avatar_file = files.get('avatar')
        if avatar_file:
            imgbb_api = "https://api.imgbb.com/1/upload?key=a9a1d711a903191591de9dfafc7f399d"
            
            # Reset file pointer to beginning in case it was read before
            if hasattr(avatar_file, 'seek') and hasattr(avatar_file, 'tell'):
                current_position = avatar_file.tell()
                if current_position > 0:
                    avatar_file.seek(0)
            
            # Only use the file object directly, don't read it separately
            files_payload = {'image': (avatar_file.name, avatar_file, avatar_file.content_type)}
            
            response = requests.post(imgbb_api, files=files_payload)

            if response.status_code == 200:
                imgbb_data = response.json()
                avatar_url = imgbb_data['data'].get('display_url') or imgbb_data['data'].get('url')
                update_data['avatar'] = avatar_url
            else:
                return JsonResponse({'error': f'Image upload failed: {response.text}'}, status=500)

        if not update_data:
            return JsonResponse({'error': 'No valid fields to update'}, status=400)

        # Update user
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )

        if result.matched_count == 0:
            return JsonResponse({'error': 'User not found'}, status=404)

        # Get updated user
        user = collection.find_one({'_id': ObjectId(user_id)})
        user_data = {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'organization': user.get('organization'),
            'phone': user.get('phone'),
            'avatar': user.get('avatar'),
            'created_at': user.get('created_at').isoformat() if user.get('created_at') else None
        }

        return JsonResponse({
            'message': 'Profile updated successfully',
            'user': user_data
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


import tempfile
import subprocess
from django.http import FileResponse
import requests,os
import os
import os
import subprocess
import requests
from django.http import FileResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from bson import ObjectId

@require_http_methods(["GET"])
def profile_idcard(request):
    try:
        collection = get_users_collection()
        user_id = getattr(request, 'user_id', None)
        if not user_id:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        user = collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)

        # Download image to current directory
        img_url = user.get('avatar')
        img_filename = f"{user_id}_profile.jpg"
        img_latex_path = ""
        if img_url:
            with open(img_filename, "wb") as f:
                f.write(requests.get(img_url).content)
            img_latex_path = img_filename
            icon_path="logoufu.png"

        # Prepare LaTeX code
        latexCode = r"""
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

% Define colors from the second document
\definecolor{lightpastelpurple}{rgb}{0.69, 0.61, 0.85}
\definecolor{darkheader}{rgb}{0.1, 0.1, 0.2}

\begin{document}
\centering
\vspace*{\fill}
\noindent
\centering
\colorbox{gray!5}{%
  \begin{minipage}[c][84mm][c]{80mm}
    % Header Section with theme from second document
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
        \colorbox{white}{\includegraphics[width=10mm,height=10mm,keepaspectratio]{"""+ icon_path +r"""}}
      \end{minipage}
    }\\[2mm]
    
    % Main Content Container
    \begin{minipage}[c]{79mm}
      % Photo and Personal Info Side by Side
      \begin{minipage}[c]{25mm}
        \vspace{0mm}%
        \centering
        \fboxsep=0pt
        \colorbox{white}{\includegraphics[height=22mm,keepaspectratio]{"""+ img_latex_path +r"""}}
      \end{minipage}
      \hfill
      \begin{minipage}[c]{52mm}
        \vspace{0mm}%
        \begin{center}
        \hfill
        {\Large\textbf{\MakeUppercase{ """ + user['name']+ r"""\\}}}
        \end{center}
        % Account Information
        \begin{center}
        \hfill
        {\small
        \begin{tabular}{@{}>{\bfseries}l@{\hspace{1mm}}r@{}}
          License Number: & """ + user['licenseNumber']+ r"""\\
          Account Type: & """ + user['account_type']+ r"""\\
          Organization: & """ + user['organization']+ r"""\\
        \end{tabular}
        }
        \end{center}
      \end{minipage}
      
      
      % Contact Details Section with colored header
      \colorbox{lightpastelpurple}{%
        \begin{minipage}[c][4mm][c]{77mm}
          \centering
          \color{white}{\normalsize \textbf{CONTACT INFORMATION}}
        \end{minipage}
      }\\[1mm]
      
      {\small
      \begin{tabular}{@{}>{\bfseries}l@{\hspace{2mm}}l@{}}
        Email: & """ + user['email']+ r"""\\
        Phone: & """ + user['phone']+ r"""\\
        ID Number: & 123-456-789 \\
        Valid Until: & 12/31/2025 \\
        Issued: & 01/15/2023 \\
      \end{tabular}
      }
      
      \vspace{3mm}
      
      % Emergency Contact Section with colored header
      \colorbox{lightpastelpurple}{%
        \begin{minipage}[c][4mm][c]{77mm}
          \centering
          \color{white}{\normalsize \textbf{EMERGENCY CONTACT}}
        \end{minipage}
      }\\[1mm]
      
      {\small
      \textbf{""" + user['name']+ " " +user['phone'] + r"""\\}
      }
    \end{minipage}
  \end{minipage}
}
\vspace*{\fill}
\end{document}
"""
        tex_path = f"{user_id}_idcard.tex"
        pdf_path = f"{user_id}_idcard.pdf"

        # Write LaTeX code to .tex file
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(latexCode)
        # os.chdir("../")
        print(os.curdir)
        print(os.listdir())
        
        try:
        # Compile LaTeX to PDF
            subprocess.run(
                ["xelatex", "-interaction=nonstopmode",tex_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True
            )
        except Exception as e:
            print(e)
            raise Exception(e)

        # Serve the PDF file
        # with open(pdf_path, "rb") as pdf_file:
        #     response = FileResponse(pdf_file, as_attachment=True, filename="idcard.pdf", content_type="application/pdf")

        # # Clean up: remove the image and tex file (keep PDF as requested)
        # if os.path.exists(img_filename):
        #     os.remove(img_filename)
        # if os.path.exists(tex_path):
        #     os.remove(tex_path)

        # return response

        pdf_file = open(pdf_path, "rb")
        response = FileResponse(pdf_file, as_attachment=True, filename="idcard.pdf", content_type="application/pdf")

        # Clean up: remove the image and tex file (keep PDF as requested)
        if os.path.exists(img_filename):
            os.remove(img_filename)
        if os.path.exists(tex_path):
            os.remove(tex_path)

        return response
    except subprocess.CalledProcessError as e:
        return JsonResponse({'error': 'Failed to generate PDF', 'details': e.stderr.decode()}, status=500)
    except Exception as e:
        # Clean up files if error occurs
        if os.path.exists(f"{user_id}_profile.jpg"):
            os.remove(f"{user_id}_profile.jpg")
        if os.path.exists(f"{user_id}_idcard.tex"):
            os.remove(f"{user_id}_idcard.tex")
        return JsonResponse({'error': str(e)}, status=500)  