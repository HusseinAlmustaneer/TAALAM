import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserCircle, Mail, Phone, Lock, User, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

// مخطط تحديث البريد الإلكتروني
const emailUpdateSchema = z.object({
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة للتأكيد" }),
});

// مخطط تحديث رقم الهاتف
const phoneUpdateSchema = z.object({
  phone: z.string().min(9, { message: "يجب أن يتكون رقم الهاتف من 9 أرقام على الأقل" }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة للتأكيد" }),
});

// مخطط تغيير كلمة المرور
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, { message: "كلمة المرور الحالية مطلوبة" }),
  newPassword: z.string()
    .min(8, { message: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل" })
    .regex(/[A-Z]/, { message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل" })
    .regex(/[a-z]/, { message: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل" })
    .regex(/[0-9]/, { message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل" }),
  confirmNewPassword: z.string().min(1, { message: "تأكيد كلمة المرور مطلوب" }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmNewPassword"],
});

type EmailUpdateData = z.infer<typeof emailUpdateSchema>;
type PhoneUpdateData = z.infer<typeof phoneUpdateSchema>;
type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("profile");

  // نموذج تحديث البريد الإلكتروني
  const emailForm = useForm<EmailUpdateData>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
    },
  });

  // نموذج تحديث رقم الهاتف
  const phoneForm = useForm<PhoneUpdateData>({
    resolver: zodResolver(phoneUpdateSchema),
    defaultValues: {
      phone: user?.phone || "",
      password: "",
    },
  });

  // نموذج تغيير كلمة المرور
  const passwordForm = useForm<PasswordUpdateData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // تحديث البريد الإلكتروني
  const emailUpdateMutation = useMutation({
    mutationFn: async (data: EmailUpdateData) => {
      const res = await apiRequest("PATCH", "/api/user/email", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث البريد الإلكتروني بنجاح",
        description: "تم تحديث معلومات حسابك",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      emailForm.reset({
        email: emailForm.getValues().email,
        password: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تحديث البريد الإلكتروني",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // تحديث رقم الهاتف
  const phoneUpdateMutation = useMutation({
    mutationFn: async (data: PhoneUpdateData) => {
      const res = await apiRequest("PATCH", "/api/user/phone", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث رقم الهاتف بنجاح",
        description: "تم تحديث معلومات حسابك",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      phoneForm.reset({
        phone: phoneForm.getValues().phone,
        password: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تحديث رقم الهاتف",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // تغيير كلمة المرور
  const passwordUpdateMutation = useMutation({
    mutationFn: async (data: PasswordUpdateData) => {
      const res = await apiRequest("PATCH", "/api/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم تغيير كلمة المرور بنجاح",
        description: "يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول",
      });
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تغيير كلمة المرور",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onEmailSubmit = (data: EmailUpdateData) => {
    emailUpdateMutation.mutate(data);
  };

  const onPhoneSubmit = (data: PhoneUpdateData) => {
    phoneUpdateMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordUpdateData) => {
    passwordUpdateMutation.mutate(data);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="py-10 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">معلومات الحساب</CardTitle>
                <CardDescription>
                  يمكنك عرض وتعديل معلومات حسابك الشخصية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCircle className="w-24 h-24 text-primary" />
                  </div>
                  <div className="text-center md:text-right">
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <p className="text-gray-600">@{user.username}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phone || "لم يتم إضافة رقم هاتف"}</p>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
                    <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
                    <TabsTrigger value="security">الأمان وكلمة المرور</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <div className="grid gap-6">
                      <div className="border rounded-md p-6">
                        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          المعلومات الشخصية
                        </h3>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">الاسم الأول</Label>
                              <Input
                                id="firstName"
                                value={user.firstName}
                                readOnly
                                className="mt-1 bg-neutral-100"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">الاسم الأخير</Label>
                              <Input
                                id="lastName"
                                value={user.lastName}
                                readOnly
                                className="mt-1 bg-neutral-100"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="username">اسم المستخدم</Label>
                            <Input
                              id="username"
                              value={user.username}
                              readOnly
                              className="mt-1 bg-neutral-100"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              لا يمكن تغيير اسم المستخدم بعد إنشاء الحساب
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact">
                    <div className="grid gap-6">
                      <div className="border rounded-md p-6">
                        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                          <Mail className="h-5 w-5 text-primary" />
                          تحديث البريد الإلكتروني
                        </h3>
                        <Form {...emailForm}>
                          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                            <FormField
                              control={emailForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>البريد الإلكتروني الجديد</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="email"
                                      placeholder="أدخل البريد الإلكتروني الجديد"
                                      disabled={emailUpdateMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={emailForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>كلمة المرور (للتأكيد)</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="أدخل كلمة المرور الحالية للتأكيد"
                                      disabled={emailUpdateMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              disabled={emailUpdateMutation.isPending}
                              className="w-full md:w-auto"
                            >
                              {emailUpdateMutation.isPending ? (
                                <>
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  جارٍ التحديث...
                                </>
                              ) : (
                                <>
                                  <Save className="ml-2 h-4 w-4" />
                                  حفظ التغييرات
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>

                      <div className="border rounded-md p-6">
                        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                          <Phone className="h-5 w-5 text-primary" />
                          تحديث رقم الهاتف
                        </h3>
                        <Form {...phoneForm}>
                          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                            <FormField
                              control={phoneForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>رقم الهاتف</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="tel"
                                      placeholder="أدخل رقم الهاتف الجديد"
                                      disabled={phoneUpdateMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={phoneForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>كلمة المرور (للتأكيد)</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="أدخل كلمة المرور الحالية للتأكيد"
                                      disabled={phoneUpdateMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              disabled={phoneUpdateMutation.isPending}
                              className="w-full md:w-auto"
                            >
                              {phoneUpdateMutation.isPending ? (
                                <>
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  جارٍ التحديث...
                                </>
                              ) : (
                                <>
                                  <Save className="ml-2 h-4 w-4" />
                                  حفظ التغييرات
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <div className="border rounded-md p-6">
                      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        تغيير كلمة المرور
                      </h3>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور الحالية</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="أدخل كلمة المرور الحالية"
                                    disabled={passwordUpdateMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور الجديدة</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="أدخل كلمة المرور الجديدة"
                                    disabled={passwordUpdateMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="أعد إدخال كلمة المرور الجديدة"
                                    disabled={passwordUpdateMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            disabled={passwordUpdateMutation.isPending}
                            className="w-full md:w-auto"
                          >
                            {passwordUpdateMutation.isPending ? (
                              <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جارٍ التحديث...
                              </>
                            ) : (
                              <>
                                <Save className="ml-2 h-4 w-4" />
                                تغيير كلمة المرور
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}