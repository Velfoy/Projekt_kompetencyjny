import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

import '@styles/components/NewPost.css';
import Overlay from '@components/layout/Overlay'; 
import { backend_url } from '@/src/main';

interface PostData {
  title: string;
  link: string;
  content: string;
}

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!title.trim() || !content.trim()) return;
    if (link && !isValidUrl(link)) return;

    const newPost: PostData = { title, link, content };

    try {
      const response = await fetch(backend_url + "api/admin/create_item", {
              method: 'POST',
              headers: {
                "Authorization": "Bearer " + token, // Don't add Content-Type here when using FormData!
              },
              body: newPost,
            });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate request

      setSuccess(true);
      setTitle('');
      setLink('');
      setContent('');
      setSubmitted(false);

      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      <div className="new_post">
        <div className="explanation_header">
          <p>Stwórz post</p>
        </div>
        <div className="creating_newpost">
          <form onSubmit={handleSubmit} className={submitted ? 'submitted' : ''} noValidate>
            <div className="info_andbutton">
              <input
                className="post_title"
                placeholder="Nazwę postu"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                required
              />
              <input
                className="post_link"
                placeholder="Link do informacji dodatkowej"
                value={link}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                type="url"
              />
              <button type="submit" className="post_create">
                Stwórz
              </button>
            </div>
            <textarea
              placeholder="Treść postu"
              value={content} 
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              required
            />
          </form>
        </div>
      </div>

      {success && <Overlay message="Nowy post został utworzony" />}
    </>
  );
};

export default NewPost;
