import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
} 