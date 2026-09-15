import { LegalPage, LegalSection } from "../components/legal/LegalPage";
import { INSTAGRAM_URL, PHONE_HREF, PHONE_NUMBER, TELEGRAM_HANDLE } from "../lib/constants";

export function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="September 2026">
      <LegalSection heading="1. Acceptance of terms">
        <p>
          By using the SmartChair bot, Mini App, or business dashboard
          (together, the "Service"), you agree to these Terms of Service. If
          you are using the Service on behalf of a business, you confirm you
          have authority to bind that business to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. What SmartChair is">
        <p>
          SmartChair is a booking marketplace and management platform that
          connects customers with independent barbershops, salons, spas, and
          other self-care businesses in Namangan. SmartChair facilitates
          discovery and booking; the businesses listed on SmartChair are
          independent operators responsible for the services they provide.
        </p>
      </LegalSection>

      <LegalSection heading="3. Accounts">
        <p>
          Your SmartChair account is tied to your Telegram account. You are
          responsible for keeping your Telegram account secure, and for all
          activity that happens under it on SmartChair.
        </p>
      </LegalSection>

      <LegalSection heading="4. Bookings">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>A booking request is sent to the business you selected and is confirmed once the business accepts it or, where enabled, automatically.</li>
          <li>Availability, pricing, and cancellation policies are set by each business and may vary between listings.</li>
          <li>SmartChair sends reminders in good faith but is not responsible for a business's failure to honor a confirmed booking, or for a customer's failure to show up.</li>
          <li>Repeated no-shows or abusive booking behavior may result in restricted access to the Service.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. For business owners">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>You must provide accurate information about your business, services, prices, staff, and availability, and keep it up to date.</li>
          <li>You are responsible for honoring bookings you accept and for the quality, safety, and legality of the services you provide.</li>
          <li>You are responsible for how you use customer data accessed through your dashboard, and must not use it outside the purpose of serving that customer.</li>
          <li>Listing on SmartChair is currently free; if paid plans or commissions are introduced in the future, you will be notified in advance and given the option to opt out before charges apply.</li>
          <li>We may remove listings that are inaccurate, fraudulent, or that repeatedly fail to honor bookings.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Submit false, misleading, or fraudulent bookings or listings.</li>
          <li>Attempt to circumvent, disrupt, or reverse-engineer the Service.</li>
          <li>Use the Service to harass, abuse, or harm another user or business.</li>
          <li>Scrape or harvest data from the Service without our written permission.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="7. Reviews and ratings">
        <p>
          Reviews should reflect a genuine completed booking. We may remove
          reviews that are fraudulent, abusive, or that violate these terms.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disclaimers and limitation of liability">
        <p>
          The Service is provided "as is." SmartChair does not guarantee that
          any listed business will be available, that services will meet your
          expectations, or that the Service will be uninterrupted or
          error-free. To the maximum extent permitted by law, SmartChair is
          not liable for indirect, incidental, or consequential damages
          arising from your use of the Service or your interactions with
          businesses listed on it.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to the Service or these terms">
        <p>
          We may update these terms or change, suspend, or discontinue parts
          of the Service at any time. Material changes will be announced
          through the bot or on this page, with an updated "Last updated"
          date above. Continued use of the Service after changes take effect
          means you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection heading="10. Governing law">
        <p>
          These terms are governed by the laws of the Republic of Uzbekistan.
          Any disputes will be resolved in the competent courts of Namangan,
          unless otherwise required by applicable law.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact us">
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
