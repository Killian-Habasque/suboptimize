import RegisterForm from "@/features/users/components/RegisterForm";

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center m-4">
      <h1 className="text-3xl my-3">Inscription</h1>
      <RegisterForm />
    </div>
  );
}