import { Card, CardContent } from "@/components/ui/card";

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-neutral-100 rounded-lg">
      <CardContent className="p-6 text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary text-white">
          <i className={`${icon} text-xl`}></i>
        </div>
        <h3 className="mt-4 text-lg font-medium text-neutral-800">{title}</h3>
        <p className="mt-2 text-neutral-600">{description}</p>
      </CardContent>
    </Card>
  );
}
