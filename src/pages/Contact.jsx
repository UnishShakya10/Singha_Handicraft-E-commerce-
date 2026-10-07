import { useState } from "react";
import { Clock, Mail, MapPin, MessageSquare, Phone, Send, User, CheckCircle2, Navigation } from "lucide-react";

const contactItems = [
  {
    icon: Phone,
    label: "Call us",
    value: "+977 1-5520000",
    href: "tel:+97715520000",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "hello@singhahandicraft.com",
    href: "mailto:hello@singhahandicraft.com",
  },
  {
    icon: MapPin,
    label: "Visit our workshop",
    value: "Patan Industrial Estate, Lalitpur, Nepal",
  },
  {
    icon: Clock,
    label: "Working hours",
    value: "Sun - Fri, 9:00 AM - 6:00 PM",
  },
];

const inputBase =
  "w-full rounded-xl border border-[#e3ddd0] bg-[#fdfbf7] py-3 pr-4 text-[#17130f] placeholder:text-[#a39a8b] transition focus:border-[#c9a227] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#c9a227]/15";

const Field = ({ id, label, icon: Icon, children }) => (
  <div className="mb-5">
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-semibold text-[#17130f]"
    >
      {label}
    </label>
    <div className="relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-3.5 top-3.5 text-[#9a771b]"
      />
      {children}
    </div>
  </div>
);
const LOCATION = "Patan Industrial Estate, Lalitpur, Nepal";
const COORDS = "27.6682072,85.3271945";

const mapEmbedUrl = `https://www.google.com/maps?q=${COORDS}&z=18&output=embed`;
const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${COORDS}`;


const Contact = () => {
  const [sent, setSent] = useState(false);

const handleSubmit = (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const subject = `Website message from ${formData.get("name")}`;

  const message = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Phone: ${formData.get("phone")}`,
    "",
    formData.get("message"),
  ].join("\n");

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=hello@singhahandicraft.com` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;

  window.open(gmailUrl, "_blank");

  setSent(true);
};


  return (<>
    <main className="bg-gradient-to-b from-[#f8f3e8] to-white">
      <section className="mx-auto max-w-3xl px-6 pb-4 pt-16 text-center md:pt-24">
        <span className="mb-4 inline-block rounded-full bg-[#c9a227]/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#9a771b]">
          Contact
        </span>
        <h1 className="mb-4 text-4xl font-bold text-[#17130f] md:text-5xl">
          Let&apos;s talk about your{" "}
          <span className="text-[#9a771b]">statue</span>
        </h1>
        <p className="mx-auto max-w-xl leading-relaxed text-[#6b6257]">
          Have a question about our handcrafted statues? Get in touch with us.
          We would be happy to help.
        </p>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:px-8 lg:grid-cols-5 lg:gap-12 lg:py-16">
        <section className="space-y-4 lg:col-span-2">
          {contactItems.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="group flex items-center gap-4 rounded-2xl border border-[#eee8da] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a227]/50 hover:shadow-md">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f3eee4] text-[#9a771b] transition group-hover:bg-[#c9a227] group-hover:text-white">
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a8b]">
                    {label}
                  </p>
                  <p className="break-words font-medium text-[#17130f]">
                    {value}
                  </p>
                </div>
              </div>
            );

            return href ? (
              <a key={label} href={href} className="block">
                {content}
              </a>
            ) : (
              <div key={label}>{content}</div>
            );
          })}
        </section>

        <section className="lg:col-span-3">
          <div className="rounded-3xl border border-[#eee8da] bg-white p-6 shadow-xl shadow-[#c9a227]/5 md:p-10">
            <h2 className="mb-1 text-2xl font-semibold text-[#17130f]">
              Get in Touch
            </h2>
            <p className="mb-8 text-sm text-[#6b6257]">
              Fill out the form and we&apos;ll get back to you soon.
            </p>

            <form onSubmit={handleSubmit}>
              <Field id="contact-name" label="Name*" icon={User}>
                <input
                  className={`${inputBase} pl-11`}
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </Field>

              <div className="grid gap-x-5 md:grid-cols-2">
                <Field id="contact-email" label="Email*" icon={Mail}>
                  <input
                    className={`${inputBase} pl-11`}
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </Field>

                <Field id="contact-phone" label="Phone Number*" icon={Phone}>
                  <input
                    className={`${inputBase} pl-11`}
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+977 98..."
                    required
                  />
                </Field>
              </div>

              <Field id="contact-message" label="Message*" icon={MessageSquare}>
                <textarea
                  className={`${inputBase} resize-y pl-11`}
                  id="contact-message"
                  name="message"
                  placeholder="Type your message here..."
                  rows={5}
                  required
                />
              </Field>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a227] px-5 py-3.5 font-bold text-[#17130f] shadow-md shadow-[#c9a227]/30 transition hover:bg-[#b28d1f] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#c9a227]/30 active:scale-[0.99]"
              >
                Send Message
                <Send
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              {sent && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700">
                  <CheckCircle2 size={18} />
                  Opening your email app to send the message…
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
      {/* Map */}
<section className="mx-auto max-w-6xl px-6 pb-16 md:px-8 lg:pb-24">
  <div className="overflow-hidden rounded-3xl border border-[#eee8da] bg-white shadow-xl shadow-[#c9a227]/5">
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f3eee4] text-[#9a771b]">
          <MapPin size={22} />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-[#17130f]">Find our workshop</h2>
          <p className="text-sm text-[#6b6257]">{LOCATION}</p>
        </div>
      </div>

      <a
        href={mapLinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a227] px-5 py-3 font-bold text-[#17130f] shadow-md shadow-[#c9a227]/30 transition hover:bg-[#b28d1f] focus:outline-none focus:ring-4 focus:ring-[#c9a227]/30"
      >
        <Navigation size={18} />
        Get Directions
      </a>
    </div>

    <iframe
      title="Singha Handicraft location"
      src={mapEmbedUrl}
      className="h-80 w-full border-0 md:h-96"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  </div>
</section>
    </main>
      </>
  );

};

export default Contact;
