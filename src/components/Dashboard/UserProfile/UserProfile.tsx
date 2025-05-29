import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../../firebase';
import { RootState } from '../../../redux/store';
import { Camera, Save } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let photoURL = currentUser.photoURL;
      
      if (selectedFile) {
        const fileRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(fileRef, selectedFile);
        photoURL = await getDownloadURL(fileRef);
      }
      
      await updateProfile(auth.currentUser!, {
        displayName,
        photoURL
      });
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: displayName,
        avatar: photoURL
      });
      
      setSelectedFile(null);
      setPreviewURL(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-neutral-200">
              {(previewURL || currentUser?.photoURL) ? (
                <img
                  src={previewURL || currentUser?.photoURL || ''}
                  alt={currentUser?.displayName || 'Profile'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600">
                  <span className="text-2xl font-bold">
                    {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-neutral-50 transition-colors duration-200"
            >
              <Camera className="h-4 w-4 text-neutral-600" />
              <input
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
          
          <div className="flex-1">
            <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input"
              placeholder="Enter your display name"
            />
          </div>
        </div>
        
        {error && (
          <div className="text-error text-sm">{error}</div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary flex items-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;