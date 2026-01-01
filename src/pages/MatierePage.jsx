import React from "react";
import MatiereComponent from '@/components/MatiereComponent'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function MatierePage(){

    return(
        <>
        <Navbar/>
        <MatiereComponent/>
        <Footer/>
        </>
    );
}