import React from "react";
import AboutComponent from "../components/AboutComponent";
import Navbar from "../components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Applications from "@/components/ApplicationComponent";
import MaterialComponent from "@/components/MaterialComponent";
import Footer from "@/components/Footer";
import ProductFamilies from "@/components/FamilyComponent";
import WelcomeSection from "@/components/WelcomeSection";
export default function Home(){
    return(
        <>
        <Navbar/>
        <Hero/>
        <WelcomeSection/>
        <ProductFamilies/>
        <Applications/>
        <FeaturedProducts/>
        <AboutComponent/>
        <MaterialComponent />
        <Footer/>
        </>
    );
}