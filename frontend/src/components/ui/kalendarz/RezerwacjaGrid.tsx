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