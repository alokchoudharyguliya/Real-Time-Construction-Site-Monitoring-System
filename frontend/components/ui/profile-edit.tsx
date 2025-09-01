'use client';

import { useState, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle } from 'lucide-react';

export function ProfileEdit({ onCancel, onSave }: { onCancel?: () => void; onSave?: () => void }) {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    organization: user?.organization || '',
    phone: user?.phone || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUploadClick = () => {
    document.getElementById('profile-image-input')?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('jwt_token');
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('age', form.age.toString());
      formData.append('organization', form.organization);
      formData.append('phone', form.phone);
      if (image) {
        formData.append('avatar', image);
      }

      const response = await fetch('http://127.0.0.1:8000/api/auth/profile/update/', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        setIsSaving(false);
        return;
      }

      login({
        ...user,
        name: data.user.name,
        age: data.user.age,
        organization: data.user.organization,
        phone: data.user.phone,
        avatar: data.user.avatar,
      });

      setSuccess('Profile updated successfully!');
      if (onSave) onSave();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-lg mx-auto mt-8" encType="multipart/form-data">
      <div className="flex flex-col items-center">
        <div className="relative group">
          <img
            src={preview || '/default-avatar.png'}
            alt="Profile Preview"
            className="h-24 w-24 rounded-full object-cover border"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleUploadClick}
            title="Change profile image"
          >
            <ArrowUpCircle className="h-10 w-10 text-white" />
          </div>
          <Input
            id="profile-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <span className="text-xs text-gray-500 mt-2">Click the arrow to upload a new image</span>
      </div>
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Age</label>
        <Input name="age" type="number" value={form.age} onChange={handleChange} />
      </div>
      <div>
        <label className="block mb-1 font-medium">Organization</label>
        <Input name="organization" value={form.organization} onChange={handleChange} />
      </div>
      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <Input name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}