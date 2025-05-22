import {Container} from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "@components/common/Header/Header";
import styles from "./styles.module.css";

const {container, wrapper} = styles;

const MainLayout=()=>{
    return(
        <Container className={container}>
            <Header></Header>
            <div className={wrapper}><Outlet/></div>
        </Container>
    );
};

export default MainLayout;