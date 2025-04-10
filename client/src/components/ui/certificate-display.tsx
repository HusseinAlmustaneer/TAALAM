import { User, Course } from "@shared/schema";

type CertificateDisplayProps = {
  userName: string;
  courseName: string;
  certificateNumber: string;
  issueDate: Date;
  compact?: boolean;
};

export default function CertificateDisplay({
  userName,
  courseName,
  certificateNumber,
  issueDate,
  compact = false
}: CertificateDisplayProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  if (compact) {
    return (
      <div className="certificate bg-white text-neutral-800 rounded-lg p-4">
        <div className="text-center border-2 border-primary/30 p-4 rounded-lg">
          <div className="text-primary">
            <i className="fas fa-award text-3xl"></i>
          </div>
          <h3 className="mt-2 text-base font-bold">شهادة إتمام دورة</h3>
          <p className="mt-1 text-xs">{courseName}</p>
          <p className="mt-2 text-xs text-neutral-500">تاريخ الإصدار: {formatDate(issueDate)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate bg-white text-neutral-800 rounded-lg shadow-lg p-8 mx-auto max-w-md">
      <div className="text-center border-4 border-primary/30 p-6 rounded-lg bg-white">
        <div className="text-primary">
          <i className="fas fa-award text-5xl"></i>
        </div>
        <h3 className="mt-4 text-xl font-bold">شهادة إتمام دورة</h3>
        <p className="mt-2">هذه الشهادة تؤكد أن</p>
        <p className="mt-2 text-xl font-bold text-primary">{userName}</p>
        <p className="mt-2">قد أكمل بنجاح دورة</p>
        <p className="mt-2 text-lg font-bold">{courseName}</p>
        <p className="mt-4 text-sm text-neutral-600">رقم الشهادة: {certificateNumber}</p>
        <p className="text-sm text-neutral-600">تاريخ الإصدار: {formatDate(issueDate)}</p>
      </div>
    </div>
  );
}
