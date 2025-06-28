import React, { useEffect, useState } from 'react';
import RezerwacjaBlok from './RezerwacjaBlok';
import '@styles/components/RezerwacjaGrid.css';
import { useAuth } from '@hooks/useAuth';
import styles from "@styles/pages/historiaadmin.module.css";
import LoadingOverlay from '../../layout/LoadingOverlay';
import { backend_url } from '@/src/main';

interface Item {
  id: number,
  name: string,
  description: string,
  image:string
}

const allProducts = [
  {
    id:1,
    title: 'STM32F103',
    description: 'To rodzina 32–bitowych mikrokontrolerów w układach scalonych produkowanych przez francusko-włoską firmę STMicroelectronics.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:2,
    title: 'STM32F407',
    description: 'Wydajny mikrokontroler z rdzeniem Cortex-M4F idealny do aplikacji DSP i audio.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:3,
    title: 'STM32G431',
    description: 'Nowoczesna seria STM32 z rdzeniem Cortex-M4 i wsparciem dla precyzyjnych pomiarów.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:4,
    title: 'STM32H743',
    description: 'Bardzo szybki układ z rdzeniem Cortex-M7, idealny do wymagających zadań.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:5,
    title: 'STM32L476',
    description: 'Mikrokontroler niskiego poboru mocy do zastosowań bateryjnych.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:6,
    title: 'STM32F051',
    description: 'Prosty i tani mikrokontroler z rdzeniem Cortex-M0.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:7,
    title: 'STM32WB55',
    description: 'Układ z wbudowanym Bluetooth LE, idealny do IoT.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:8,
    title: 'STM32F767',
    description: 'Cortex-M7 z zaawansowaną obsługą grafiki i Ethernetu.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:9,
    title: 'STM32G071',
    description: 'Ekonomiczna seria STM32 z bogatym zestawem peryferiów.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:10,
    title: 'STM32F100',
    description: 'Ekonomiczny wybór do podstawowych aplikacji embedded.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:11,
    title: 'STM32L152',
    description: 'Zbalansowane parametry między wydajnością a energooszczędnością.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:12,
    title: 'STM32U575',
    description: 'Najnowsza linia z zaawansowanymi funkcjami bezpieczeństwa.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:13,
    title: 'STM32G474',
    description: 'Zintegrowane wzmacniacze operacyjne i zaawansowana obsługa sygnałów.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:14,
    title: 'STM32F215',
    description: 'Obsługuje zaawansowane interfejsy i szybki dostęp do pamięci.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:15,
    title: 'STM32F100',
    description: 'Ekonomiczny wybór do podstawowych aplikacji embedded.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:16,
    title: 'STM32L152',
    description: 'Zbalansowane parametry między wydajnością a energooszczędnością.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:17,
    title: 'STM32U575',
    description: 'Najnowsza linia z zaawansowanymi funkcjami bezpieczeństwa.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:18,
    title: 'STM32G474',
    description: 'Zintegrowane wzmacniacze operacyjne i zaawansowana obsługa sygnałów.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:19,
    title: 'STM32F215',
    description: 'Obsługuje zaawansowane interfejsy i szybki dostęp do pamięci.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:20,
    title: 'STM32L562',
    description: 'Seria z certyfikowanymi funkcjami bezpieczeństwa i ultra-niskim poborem mocy.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:21,
    title: 'STM32L562',
    description: 'Seria z certyfikowanymi funkcjami bezpieczeństwa i ultra-niskim poborem mocy.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:22,
    title: 'STM32F100',
    description: 'Ekonomiczny wybór do podstawowych aplikacji embedded.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:23,
    title: 'STM32L152',
    description: 'Zbalansowane parametry między wydajnością a energooszczędnością.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:24,
    title: 'STM32U575',
    description: 'Najnowsza linia z zaawansowanymi funkcjami bezpieczeństwa.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:25,
    title: 'STM32G474',
    description: 'Zintegrowane wzmacniacze operacyjne i zaawansowana obsługa sygnałów.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:26,
    title: 'STM32F215',
    description: 'Obsługuje zaawansowane interfejsy i szybki dostęp do pamięci.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:27,
    title: 'STM32L562',
    description: 'Seria z certyfikowanymi funkcjami bezpieczeństwa i ultra-niskim poborem mocy.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:28,
    title: 'STM32H503',
    description: 'Nowa generacja mikrokontrolerów z rdzeniem Cortex-M33.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:29,
    title: 'STM32L031',
    description: 'Ultraniski pobór energii i kompaktowy rozmiar.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:30,
    title: 'STM32F302',
    description: 'Idealny do zastosowań analogowych i cyfrowych dzięki wbudowanemu FPU.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:31,
    title: 'STM32F100',
    description: 'Ekonomiczny wybór do podstawowych aplikacji embedded.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:32,
    title: 'STM32L152',
    description: 'Zbalansowane parametry między wydajnością a energooszczędnością.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:33,
    title: 'STM32U575',
    description: 'Najnowsza linia z zaawansowanymi funkcjami bezpieczeństwa.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:34,
    title: 'STM32G474',
    description: 'Zintegrowane wzmacniacze operacyjne i zaawansowana obsługa sygnałów.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:35,
    title: 'STM32F215',
    description: 'Obsługuje zaawansowane interfejsy i szybki dostęp do pamięci.',
    imageUrl: '/img/stm.jpg',
  },
  {
     id:36,
    title: 'STM32L562',
    description: 'Seria z certyfikowanymi funkcjami bezpieczeństwa i ultra-niskim poborem mocy.',
    imageUrl: '/img/stm.jpg',
  },
];

const itemsPerPage = 6;

const RezerwacjaGrid: React.FC = () => {
  const { role} = useAuth();
  const [products, setProducts] = useState<Item[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading]=useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/item/get_items");
        const data = await response.json();
        setProducts(data);
      };
      fetchData();
    }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number) => {
    console.log(`Deleting item with id: ${id}`);
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  if (loading) return <LoadingOverlay />;
  return (
    <>
      <div className="product-grid">
        {paginatedProducts.map((product) => (
          <RezerwacjaBlok
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            imageUrl={product.image}
            role={role as string}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className={styles.pagination_zgloszenia} style={{ backgroundColor: "#F4F4F4", border: "1px solid #99C49A", borderRadius: "10px", padding: "5px 10px" }}>
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === 1} onClick={() => setCurrentPage(1)//Here be pagination

        }>
          <i className="fa-solid fa-angles-left"></i>
        </button>
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          {windowWidth > 470 ? 'Poprzedni' : <i className="fa-solid fa-chevron-left"></i>}
        </button>

        {(() => {
          const pages = [];
          if (pageCount <= 5) {
            for (let i = 1; i <= pageCount; i++) {
              pages.push(
                <button key={i} className={`${styles.pageButton_zgloszenia} ${currentPage === i ? styles.active_zgloszenia : ''}`} onClick={() => setCurrentPage(i)}>
                  {i}
                </button>
              );
            }
          } else {
            pages.push(
              <button key={1} className={`${styles.pageButton_zgloszenia} ${currentPage === 1 ? styles.active_zgloszenia : ''}`} onClick={() => setCurrentPage(1)}>
                1
              </button>
            );

            if (currentPage > 3) pages.push(<span key="dots-start">...</span>);
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(pageCount - 1, currentPage + 1);
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button key={i} className={`${styles.pageButton_zgloszenia} ${currentPage === i ? styles.active_zgloszenia : ''}`} onClick={() => setCurrentPage(i)}>
                  {i}
                </button>
              );
            }
            if (currentPage < pageCount - 2) pages.push(<span key="dots-end">...</span>);
            pages.push(
              <button key={pageCount} className={`${styles.pageButton_zgloszenia} ${currentPage === pageCount ? styles.active_zgloszenia : ''}`} onClick={() => setCurrentPage(pageCount)}>
                {pageCount}
              </button>
            );
          }
          return pages;
        })()}

        <button className={styles.pageButton_zgloszenia} disabled={currentPage === pageCount} onClick={() => setCurrentPage((prev) => prev + 1)}>
          {windowWidth > 470 ? 'Następny' : <i className="fa-solid fa-chevron-right"></i>}
        </button>
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === pageCount} onClick={() => setCurrentPage(pageCount)}>
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </>
  );
};

export default RezerwacjaGrid;