import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, LoginData, RegisterData } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Handle query parameter to set active tab
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const tab = params.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [location]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);
  
  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  
  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <>
      <Header />
      <main className="py-10 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 lg:w-5/12">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">تسجيل الدخول</CardTitle>
                      <CardDescription>أدخل بيانات حسابك للوصول إلى الدورات</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم المستخدم</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    placeholder="أدخل اسم المستخدم" 
                                    disabled={loginMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>كلمة المرور</FormLabel>
                                  <a href="#" className="text-sm text-primary hover:underline">نسيت كلمة المرور؟</a>
                                </div>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    type="password" 
                                    placeholder="أدخل كلمة المرور" 
                                    disabled={loginMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري تسجيل الدخول...
                              </>
                            ) : (
                              'تسجيل الدخول'
                            )}
                          </Button>
                          
                          <div className="text-center">
                            <p className="text-sm text-neutral-600">
                              ليس لديك حساب؟{' '}
                              <button 
                                type="button"
                                onClick={() => setActiveTab('register')}
                                className="text-primary hover:underline"
                              >
                                إنشاء حساب
                              </button>
                            </p>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">إنشاء حساب جديد</CardTitle>
                      <CardDescription>سجل الآن للوصول إلى مئات الدورات المميزة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الاسم الأول</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field}
                                      placeholder="أدخل الاسم الأول" 
                                      disabled={registerMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الاسم الأخير</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field}
                                      placeholder="أدخل الاسم الأخير" 
                                      disabled={registerMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم المستخدم</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    placeholder="أدخل اسم المستخدم" 
                                    disabled={registerMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    type="email"
                                    placeholder="أدخل البريد الإلكتروني" 
                                    disabled={registerMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    type="password" 
                                    placeholder="أدخل كلمة المرور" 
                                    disabled={registerMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تأكيد كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    type="password" 
                                    placeholder="أعد إدخال كلمة المرور" 
                                    disabled={registerMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="terms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-reverse space-x-3 space-y-0 rounded-md">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={registerMutation.isPending}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none mr-2">
                                  <FormLabel>
                                    أوافق على <a href="#" className="text-primary hover:underline">شروط الاستخدام</a> و <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a>
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري إنشاء الحساب...
                              </>
                            ) : (
                              'إنشاء حساب'
                            )}
                          </Button>
                          
                          <div className="text-center">
                            <p className="text-sm text-neutral-600">
                              لديك حساب بالفعل؟{' '}
                              <button 
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className="text-primary hover:underline"
                              >
                                تسجيل الدخول
                              </button>
                            </p>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="w-full md:w-1/2 lg:w-7/12 hidden md:block">
              <div className="bg-gradient-to-r from-primary to-blue-600 p-8 rounded-lg shadow-lg text-white">
                <h2 className="text-3xl font-bold mb-4">انضم إلى مجتمع التعلم الأكبر في المملكة</h2>
                <p className="text-xl mb-6">منصة تعلّم توفر لك دورات احترافية باللغة العربية مع شهادات معتمدة</p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full ml-4">
                      <i className="fas fa-graduation-cap text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">+١٠٠ دورة تدريبية</h3>
                      <p>دورات في مختلف المجالات التقنية والإدارية والتسويقية</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full ml-4">
                      <i className="fas fa-users text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">+١٠,٠٠٠ متعلم</h3>
                      <p>انضم إلى مجتمع المتعلمين وشارك تجربتك معهم</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full ml-4">
                      <i className="fas fa-certificate text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">شهادات معتمدة</h3>
                      <p>احصل على شهادة بعد إتمام كل دورة لتعزيز سيرتك الذاتية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
