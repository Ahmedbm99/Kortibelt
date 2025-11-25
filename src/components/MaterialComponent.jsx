import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Surface from "@/assets/surface.jpeg";
import fibre from "@/assets/fibre.jpg";
import raw from "@/assets/raw.jpg";
import { NavLink } from "react-router-dom";
export default function ClassificationCards() {
  const items = [
    {
      title: "Surface Classification",
      image: Surface,
      link: "/classement?id=1",
    },
    {
      title: "Fiber Classification",
      image: fibre,
      link: "/classement?id=2",
    },
    {
      title: "Raw Material Classification",
      image: raw,
      link: "/classement?id=3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {items.map((item, index) => (
        <a key={index}  className="block">
          <Card className="rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div className="w-full h-48 relative">
              <img
                src={item.image}
                alt={item.title}
                className="object-cover h-60 w-full"
              />
            </div>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">{item.title}</h2>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer text-white px-6 py-2 rounded-xl">
                <NavLink to={item.link}>
                  Read More
                </NavLink>
              </Button>
            </CardFooter>
          </Card>
        </a>
      ))}
    </div>
  );
}