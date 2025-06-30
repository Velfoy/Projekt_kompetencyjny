import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import '@styles/components/NewItem.css';
import Overlay from '@components/layout/Overlay';
import { backend_url } from '@/src/main';

//const units = ['Jednostka A', 'Jednostka B', 'Jednostka C'];
//const categories = ['Elektronika', 'Meble', 'Narzędzia'];
//const types = ['Typ 1', 'Typ 2', 'Typ 3'];

// Mock data to define which fields are required (just names of fields)
const requiredFields: (keyof FormData)[] = [
  'name',
  'guardian',
  'unit',
  'reservationType',
  'location',
  'description',
  'exploration',
  'technical',
];

// Type for formData keys
type FormData = {
  name: string;
  unit: string;
  guardian: string;
  reservationType: string;
  itemType: string;
  location: string;
  description: string;
  exploration: string;
  technical: string;
};

const NewItem: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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

  const token = localStorage.getItem('auth_token');

  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 830);
  const [guardians, setGuardians] = useState<string[]>(['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński']);
  const [units, setUnits] = useState<string[]>([]);//Lera I hope we can change those to use numerics id later cuz otherwise it would be awkward
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 830);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/admin/get_unit_data", {method: 'GET', 
              headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
        const data = await response.json();
        setGuardians(data.admins);
        setUnits(data.units);
        setCategories(data.categories);
        setTypes(data.types);//What is a "type" remains a mystery
      };
      fetchData();
    }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file =>
        /\.(pdf|txt|docx)$/i.test(file.name)
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isValid = /\.(png|jpe?g)$/i.test(file.name);

      if (isValid) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('Dozwolone formaty to: .jpg, .jpeg, .png');
      }
    }
  };

  // Check error only if the field is required and empty
  const isError = (field: keyof FormData) =>
    submitted && requiredFields.includes(field) && !formData[field].trim();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate only required fields
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        console.log("Nema");
        return; // stop submitting if any required field is empty
      }
    }

    const payload = new FormData();

    for (const key in formData) {
      payload.append(key, formData[key as keyof FormData]);
    }

    if (image) {
      payload.append('image', image);
    }

    files.forEach(file => {
      payload.append('files', file); // backend must expect "files" as multiple entries
    });

    try {
      console.log('Sending new item to server:', payload);

        const response = await fetch(backend_url + "api/admin/create_item", {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + token, // Don't add Content-Type here when using FormData!
        },
        body: payload,
      });

      // Simulate a server request delay
      //await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form on success
      setSuccess(true);//We'll do error handling later aight?
      setFormData({
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
      setFiles([]);
      setImage(null);
      setImagePreview(null);
      setSubmitted(false);

      // Hide success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error creating new item:', error);
    }
  };

  return (
    <div className="new_post">
      <div className="explanation_header">
        <p>Stwórz przedmiot</p>
      </div>

      <form className="object-form" onSubmit={handleSubmit}>
        {/* First row */}
        <div className="first_row">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nazwa przedmiotu"
            className={`firstRowinput ${isError('name') ? 'input-error' : ''}`}
          />
          <select
            name="guardian"
            value={formData.guardian}
            onChange={handleChange}
            className={isError('guardian') ? 'input-error' : ''}
          >
            <option disabled value="">
              Wybierz opiekuna
            </option>
            {guardians.map((g, idx) => (
              <option key={idx} value={g}>
                {g}
              </option>
            ))}
          </select>
          {!isMobile && <button type="submit">Stwórz</button>}
        </div>

        {/* Second row */}
        <div className="first_row">
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className={isError('unit') ? 'input-error' : ''}
          >
            <option disabled value="">
              Wybierz jednostkę
            </option>
            {units.map((u, idx) => (
              <option key={idx} value={u}>
                {u}
              </option>
            ))}
          </select>

          <select
            name="reservationType"
            value={formData.reservationType}
            onChange={handleChange}
            className={isError('reservationType') ? 'input-error' : ''}
          >
            <option disabled value="">
              Wybierz kategorie
            </option>
            {categories.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            className={isError('itemType') ? 'input-error' : ''}
          >
            <option disabled value="">
              Wybierz typ
            </option>
            {types.map((t, idx) => (
              <option key={idx} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Textareas */}
        <textarea
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Opisz lokalizację przedmiotu"
          className={isError('location') ? 'input-error' : ''}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Opis przedmiotu"
          className={isError('description') ? 'input-error' : ''}
        />
        <textarea
          name="exploration"
          value={formData.exploration}
          onChange={handleChange}
          placeholder="Opisz zasady eksploracji"
          className={isError('exploration') ? 'input-error' : ''}
        />
        <textarea
          name="technical"
          value={formData.technical}
          onChange={handleChange}
          placeholder="Opisz specyfikację techniczną"
          className={isError('technical') ? 'input-error' : ''}
        />

        {/* File upload */}
        <div className="file-upload">
          <label htmlFor="fileUploadDocs">
            Przeciągnij i upuść pliki (.pdf, .docx, .txt)
            <input
              id="fileUploadDocs"
              type="file"
              multiple
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
            />
            <p>Maksymalny rozmiar pliku 5MB</p>
            {files.map((file, idx) => (
              <div key={idx} className="file-row">
                {file.name} <span>{(file.size / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            ))}
          </label>
        </div>

        {/* Image upload */}
        <div className="file-upload">
          <label htmlFor="fileUploadImages">
            Dodaj zdjęcie (.jpg, .jpeg, .png)
            <input
              id="fileUploadImages"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleImageChange}
            />
            <p>Maksymalnie 5MB</p>

            {image && (
              <div className="image-preview">
                <img src={imagePreview || ''} alt="Podgląd" />
                <div className="file-row">
                  {image.name} <span>{(image.size / 1024 / 1024).toFixed(1)}MB</span>
                </div>
              </div>
            )}
          </label>
        </div>

        {isMobile && <button type="submit">Stwórz</button>}
      </form>

      {success && <Overlay message="Nowy item został utworzony" />}
    </div>
  );
};

export default NewItem;
