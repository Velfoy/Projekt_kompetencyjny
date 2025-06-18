import React, { useState } from 'react';
import '@styles/components/NewItem.css';

const NewItem: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    guardian: '',
    reservationType: '',
    itemType: '',
    location: '',
    description: '',
    exploration: '',
    technical: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData, files);
  };

  return (
     <div className="new_post">
        <div className="explanation_header">
            <p>Stwórz przedmiot</p>
        </div>
        <form className="object-form" onSubmit={handleSubmit}>
            <div className="first_row">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Nazwa przedmiotu" />
                <select name="guardian" value={formData.guardian} onChange={handleChange}>
                    <option>Wybierz opiekuna</option>
                </select>
            </div>

            <div className="first_row">
                <select name="unit" value={formData.unit} onChange={handleChange}>
                <option>Wybierz jednostkę</option>
                </select>
                <select name="reservationType" value={formData.reservationType} onChange={handleChange}>
                <option>Wybierz typ rezerwowania</option>
                </select>
                <select name="itemType" value={formData.itemType} onChange={handleChange}>
                <option>Wybierz typ przedmiotu</option>
                </select>
            </div>

            <textarea
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Opisz lokalizację przedmiotu"
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Opis przedmiotu"
            />
            <textarea
                name="exploration"
                value={formData.exploration}
                onChange={handleChange}
                placeholder="Opisz zasady eksploracji"
            />
            <textarea
                name="technical"
                value={formData.technical}
                onChange={handleChange}
                placeholder="Opisz specyfikację techniczną"
            />

            <div className="file-upload">
                <label htmlFor="fileUpload">
                Przeciągnij i upuść pliki, aby przesłać dokumentację techniczną
                </label>
                <input id="fileUpload" type="file" multiple onChange={handleFileChange} />
                <p>Maksymalny rozmiar pliku 5MB</p>

                {files.map((file, idx) => (
                <div key={idx} className="file-row">
                    {file.name} <span>{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                </div>
                ))}
            </div>

            <button type="submit">Stwórz</button>
        </form>
     </div>
  
  );
};

export default NewItem;
