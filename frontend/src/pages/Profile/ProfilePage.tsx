import { useAuth } from '@hooks/useAuth';
import { useState } from 'react';
import styles from '@styles/pages/profile.module.css';

const ProfilePage = () => {
  const { isAuth, role,username } = useAuth();
  const [panelState, setPanelState]=useState(0);
  const [activeTab, setActiveTab] = useState("reserve_now");
   const [activeTab2, setActiveTab2] = useState("new_item");
  const changePanel=()=>{
    if(panelState===0)setPanelState(1);
    else if(panelState==1)setPanelState(0);
  }
  if (!isAuth) return null;

  return (
    <div className={styles.profile_container}>
      <div className={styles.top_container}>
        <div className={styles.userinfo}>
          Konto
          <div className={styles.indexInfo}>
              <i className="fa-solid fa-user-pen"></i>
              <p className={styles.indextekst}>Username:<span>{username}</span></p>
          </div>
        </div>
        {(role=="admin") &&
          <button className={styles.panels_change} onClick={changePanel}>{(panelState ==0?"Przełącz na admin panel":"Przełącz na user panel")}</button>
        }
      </div>
      {panelState==0 ?(
      <div className={styles.tabs_rezerwacje}>
        <div className={styles.tabs}>
          <button
            className={styles[activeTab === "reserve_now" ? "active_specs" : "non_specs"]}
            onClick={() => setActiveTab("reserve_now")}
          >
            Aktualne rezerwacje
          </button>
          <button
            className={styles[activeTab === "reserve_done" ? "active_notes" : "non_notes"]}
            onClick={() => setActiveTab("reserve_done")}
          >
            Zakończone rezerwacje
          </button>
        </div>

        <div className={styles.tab_content}>
          {activeTab === "reserve_now" ? (
            <p>Brak aktualnych rezerwacji.</p>
          ) : (
            <p>Brak zakończonych rezerwacji.</p>
          )}
        </div>
      </div>  
      ):(
        <div className={styles.create_new_items}>
          <div className={styles.tabs}>
            <button
              className={styles[activeTab === "new_item" ? "active_specs" : "non_specs"]}
              onClick={() => setActiveTab("new_item")}
            >
              Nowy przedmiot
            </button>
            <button
              className={styles[activeTab === "users" ? "active_notes" : "non_notes"]}
              onClick={() => setActiveTab("users")}
            >
              Użytkownicy
            </button>
              <button
              className={styles[activeTab === "new_post" ? "active_post" : "non_post"]}
              onClick={() => setActiveTab("new_post")}
            >
              Nowy post
            </button>
          </div>

          <div className={styles.tab_content}>
            {activeTab === "new_item" ? (
              <p>Nowy przedmiot.</p>
            ) :(activeTab === "users")? (
              <p>Users</p>
            ):(
               <p>Nowy post</p>
            )}
          </div>
        </div>  
      )}
    </div>
  );
};

export default ProfilePage;