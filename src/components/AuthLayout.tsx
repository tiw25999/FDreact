import Navbar from './Navbar';

export default function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#1e40af]">
            <Navbar />
            <div className="pt-20 min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/90 backdrop-blur border rounded-3xl shadow-xl p-8">
                        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
                        {children}
                    </div>
                    <p className="text-center text-white/80 text-xs mt-4">E‑Tech • Modern UI</p>
                </div>
            </div>
        </div>
    );
}


