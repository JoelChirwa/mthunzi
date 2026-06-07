export default function ContactMap() {
  return (
    <div className="mx-auto max-w-5xl px-8 md:px-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="h-80 overflow-hidden rounded-2xl border border-gray-100 shadow-xl shadow-green-900/5 sm:h-[420px] transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.5635245934755!2d35.3193!3d-13.9626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940a3e1234567%3A0x123456789!2sLilongwe%2C%20Malawi!5e0!3m2!1sen!2sma!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mthunzi Trust Office Map"
          ></iframe>
        </div>

        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Visit Us
            </span>
            <h3 className="mt-4 text-3xl font-black text-gray-900 md:text-4xl tracking-tight">
              Our Head Office Location
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Drop by our headquarters in Lilongwe, Malawi. We are open during regular business hours
              and always welcome partners, prospective volunteers, and interested supporters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-gray-900 text-sm">Regular Office Hours</h4>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Monday - Friday
                <br />
                <span className="font-bold text-gray-900">8:00 AM - 5:00 PM CAT</span>
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-gray-900 text-sm">Weekend Operations</h4>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Saturday & Sunday
                <br />
                <span className="font-bold text-gray-400">Closed</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50/50 p-5 shadow-sm">
            <p className="text-xs leading-relaxed text-orange-950 font-semibold">
              Looking for a partnership meeting? We suggest scheduling in advance via email to ensure the respective program lead is available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
