"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import "../../css/login.css";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Correo inválido";
    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token || !data.usuario) {
        setErrors({ general: data.message || "Credenciales incorrectas." });
        setLoading(false);
        return;
      }

      const userData = {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        primerApellido: data.usuario.primerApellido,
        segundoApellido: data.usuario.segundoApellido,
        email: data.usuario.email,
        rol: data.usuario.rol,
        proyectos: data.usuario.proyectos || [],
        token: data.token,
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      document.cookie = "token=; path=/; max-age=0;";
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax${
        window.location.protocol === "https:" ? "; Secure" : ""
      }`;

      router.replace("/proyectos");
    } catch (error) {
      setErrors({ general: "No se pudo conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    router.push("/terminos");
  };

  return (
    <div className="login-background fade-in">
      <div className="login-card pop-in">

        <div className="logo">
          <img src="/TIMP.png" alt="Logo" className="login-logo" />
        </div>

        <h2 className="login-title">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              className="login-input animated-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group password-group">
            <input
              className="login-input animated-input"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {errors.general && (
            <span className="error error-general">{errors.general}</span>
          )}

          <button type="submit" className="login-btn water-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Entrar"}
          </button>
        </form>

        <p className="login-terms">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="login-link" onClick={handleTermsClick}>
            Términos y Condiciones
          </a>.
        </p>
      </div>
    </div>
  );
}
