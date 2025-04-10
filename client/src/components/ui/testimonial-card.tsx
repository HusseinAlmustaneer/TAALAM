import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TestimonialCardProps = {
  name: string;
  image: string;
  rating: number;
  text: string;
};

export default function TestimonialCard({
  name,
  image,
  rating,
  text
}: TestimonialCardProps) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <Card className="bg-neutral-100 rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <Avatar className="h-12 w-12 rounded-full">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mr-4">
            <h3 className="text-lg font-medium text-neutral-800">{name}</h3>
            <div className="flex mt-1 text-amber-500">
              {renderStars(rating)}
            </div>
          </div>
        </div>
        <p className="mt-4 text-neutral-600">{text}</p>
      </CardContent>
    </Card>
  );
}
