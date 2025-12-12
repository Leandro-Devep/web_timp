// /app/terminos/page.jsx
import Link from 'next/link';

export default function TerminosYCondicionesPage() {
  return (
    // Usa la clase que tiene el fondo difuminado.
    <div className="gradient-background">
      {/* Usa la clase que tiene los estilos para la caja de contenido */}
      <div className="terms-content-box">
        <h1>Términos y Condiciones de Uso</h1>
        <p>
          Este proyecto ha sido creado por los ingenieros ALEXIS y DAYANA.
          Nuestra misión es desarrollar soluciones web innovadoras para empresas de
          telecomunicaciones, con el objetivo de optimizar sus operaciones y
          mejorar la experiencia del cliente.
        </p>
        <p>
          Al utilizar esta plataforma, usted acepta los siguientes términos de
          uso. Esta web está diseñada para ser una herramienta profesional para
          la gestión de proyectos y recursos. Cualquier uso indebido, acceso
          no autorizado a la información, o intento de modificar la funcionalidad
          de la plataforma está estrictamente prohibido y podría resultar en la
          suspensión de su cuenta y acciones legales.
        </p>
        <p>
          Nos comprometemos a proteger la privacidad y la seguridad de los datos
          de nuestros usuarios. Toda la información personal y de la empresa
          será tratada con la máxima confidencialidad. Sin embargo, el usuario
          es responsable de mantener la seguridad de su contraseña y de no
          compartir sus credenciales de acceso con terceros.
        </p>
        <p>
          Para cualquier duda o sugerencia, no dude en contactar a nuestro equipo
          de soporte. Estamos dedicados a mejorar continuamente esta plataforma
          para satisfacer las necesidades de nuestros clientes y ayudarlos a
          alcanzar sus metas en el competitivo mundo de las telecomunicaciones.
        </p>
        {/* Opcional: Un botón o enlace para regresar */}
        <p style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/">
            Volver a la página de inicio
          </Link>
        </p>
      </div>
    </div>
  );
}