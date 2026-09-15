import { LegalPage, LegalSection } from "../components/legal/LegalPage";
import { INSTAGRAM_URL, PHONE_HREF, PHONE_NUMBER, TELEGRAM_HANDLE } from "../lib/constants";

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <LegalSection heading="1. Who we are">
        <p>
          SmartChair ("we," "us," "our") operates a Telegram-based platform
          that helps people discover and book appointments with barbershops,
          salons, spas, and other self-care businesses, and helps those
          businesses manage bookings, staff, and customers. This policy
          explains what information we collect, how we use it, and the
          choices you have.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information we collect">
        <p>When you use SmartChair as a customer, we collect:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Your Telegram ID, name, and username, provided by Telegram when you open the bot or Mini App.</li>
          <li>Your phone number, if you share it to confirm a booking.</li>
          <li>Your approximate or shared location, if you choose to share it to find nearby businesses.</li>
          <li>Booking details you submit: service, business, specialist, date, time, and any notes.</li>
          <li>Your ratings, reviews, and favorites.</li>
        </ul>
        <p>When you list a business on SmartChair, we additionally collect:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Business name, address, working hours, services, prices, and photos.</li>
          <li>Staff names, schedules, and the services they perform.</li>
          <li>Booking and customer records generated through your use of the platform.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How we use your information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To operate the booking marketplace — matching customers with available businesses and time slots.</li>
          <li>To send booking confirmations, reminders, and status updates via Telegram.</li>
          <li>To show businesses the bookings, customer history, and schedules they need to run their day.</li>
          <li>To improve search, ranking, and recommendations across the platform.</li>
          <li>To prevent fraud, abuse, and double-booking.</li>
          <li>To communicate with you about your account or a booking, when needed.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. How information is shared">
        <p>
          When you book an appointment, we share the details needed to fulfil
          that booking (your name, phone number if provided, and appointment
          details) with the business you booked. Businesses see the booking
          and customer history generated through their own listing; they do
          not see data belonging to other businesses on SmartChair.
        </p>
        <p>
          We do not sell your personal information. We may share limited data
          with service providers who help us operate the platform (such as
          Telegram, for message delivery, and mapping services, to show
          nearby businesses), each bound to use it only to provide that
          service.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data retention">
        <p>
          We keep booking and account data for as long as your account is
          active, and for a reasonable period afterward to resolve disputes,
          enforce our terms, and meet legal obligations. You can request
          deletion of your data as described in Section 7.
        </p>
      </LegalSection>

      <LegalSection heading="6. Security">
        <p>
          We use reasonable technical and organizational measures to protect
          your information. No system is completely secure, and we cannot
          guarantee absolute security of data transmitted through Telegram or
          the internet.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your rights and choices">
        <p>
          You can review, correct, or request deletion of your personal data,
          stop sharing your location, or close your account at any time by
          contacting us using the details below or through the bot's profile
          settings. Business owners can update or remove their listing data
          from their dashboard.
        </p>
      </LegalSection>

      <LegalSection heading="8. Children's privacy">
        <p>
          SmartChair is not directed at children under 16. We do not
          knowingly collect personal information from children under 16.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will
          be announced through the bot or on this page, with an updated
          "Last updated" date above.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact us">
        <p>
          For any privacy questions or requests, reach us at:
        </p>
        <ul className="list-none space-y-1.5">
          <li>
            Phone:{" "}
            <a href={PHONE_HREF} className="text-accent hover:underline">
              {PHONE_NUMBER}
            </a>
          </li>
          <li>Telegram: {TELEGRAM_HANDLE}</li>
          <li>
            Instagram:{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              _smartchair
            </a>
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
