import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import FamilleServices from "@/services/FamilyServices";
import TypesServices from "@/services/TypesServices";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFamily } from "@/store/familySlice";
import { setTypes } from "@/store/typeSlice";
import toast from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function SidebarClassification({ selectedCategory, onCategorySelect, selectedFamilly, onFamilySelect }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language } = useLanguage(); // 'fr' or 'en'
  const [families, setFamilies] = useState([]);
  const [types, setTypesState] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch families and types
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const familyData = await FamilleServices.getAllFamilies();
        const typesData = await TypesServices.getAllTypes();

        setFamilies(familyData.data);
        setTypesState(typesData.data);

        dispatch(setFamily(familyData.data));
        dispatch(setTypes(typesData.data));
      } catch (err) {
        console.error(err);
        toast.error(
          language === "en"
            ? "Error loading categories"
            : "Erreur lors du chargement des catégories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, language]);

  const categories = families.map((f) => ({
    name: language === "en" ? f.nomAnglais : f.nomFrancais,
    family_id: f.id,
    sub: types
      .filter((t) => t.famille_id === f.id)
      .map((t) => ({
        name: language === "en" ? t.nomAnglais : t.nomFrancais,
        type_id: t.id,
      })),
  }));

  if (loading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <aside className="w-96 p-1 mt-24 ">
      <h2 className="text-3xl font-bold">
        {language === "en" ? "Product Category" : "Catégorie de produit"}
      </h2>
      <div className="h-1 bg-orange-500 w-28 mt-2 mb-6"></div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {categories.map((cat, i) => (
          <AccordionItem
            key={i}
            value={(cat.name || "unnamed").replace(/ /g, "-").toLowerCase()}
          >
            <AccordionTrigger
              className={`text-gray-800 font-medium cursor-pointer ${
                selectedFamilly === cat.family_id ? "text-accent" : ""
              }`}
              onClick={() => {onFamilySelect && onFamilySelect(cat.family_id ); navigate('/products');}}
              
            >
              {cat.name || (language === "en" ? "Unnamed" : "Sans nom")}
            </AccordionTrigger>

            {cat.sub.length > 0 && (
              <AccordionContent>
                <ul className="ml-4 mt-2 space-y-2 border-l pl-4 border-gray-300">
                  {cat.sub.map((sub, j) => (
                    <li
                      key={j}
                      className={`text-gray-600 hover:text-gray-900 cursor-pointer py-1 ${
                        selectedCategory === sub.type_id ? "text-accent font-semibold" : ""
                      }`}
                      onClick={() => {onCategorySelect && onCategorySelect(sub.type_id);  navigate('/products');}}
                    >
                      {sub.name || (language === "en" ? "Unnamed" : "Sans nom")}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
