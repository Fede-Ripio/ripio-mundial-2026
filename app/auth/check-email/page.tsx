import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-8 text-center">
          
          <div className="text-6xl mb-6">📬</div>
          
          <h1 className="text-3xl font-bold mb-4">¡Revisá tu email!</h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed text-lg">
            Te enviamos un <strong className="text-purple-400">link de acceso</strong> a tu casilla.
          </p>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-300 font-semibold mb-2">
              📧 Hacé click en el link del email
            </p>
            <p className="text-xs text-gray-400">
              Te va a llevar directo al sitio sin pedir contraseña
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-300">
              <strong>💡 ¿No lo ves?</strong> Revisá la carpeta de <strong className="text-white">spam o promociones</strong>
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-400 border-t border-gray-700 pt-4">
            <p>⏱️ El link expira en <strong className="text-white">1 hora</strong></p>
            <p>🔒 Funciona una sola vez por seguridad</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <Link 
              href="/login" 
              className="text-purple-400 hover:text-purple-300 font-semibold text-sm"
            >
              ← Enviar otro link
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
