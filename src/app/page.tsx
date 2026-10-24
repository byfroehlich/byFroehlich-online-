import { Fragment } from "react";
import Image from "next/image";
import CopyPlates from "@/components/CopyPlates";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LegalLink, { OpenFromHash } from "@/components/LegalLink";
import SceneCanvas from "@/components/SceneCanvas";

const ticker = ["Kleine Tools", "Web-Apps", "Mobile Apps", "Automatisierungen", "Digitale Mitarbeiter", "KI-Lösungen", "Ganze Systeme"];

function TickerRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="ticker-row" aria-hidden={hidden || undefined}>
      {ticker.map((t) => (
        <Fragment key={t}>
          <span>{t}</span>
          <i />
        </Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <main id="top">
        <Hero />

        <section className="beats wrap gut" id="prinzip" aria-label="Prinzip">
          <div className="beats-head">
            <h2>Wie aus einer Idee etwas wird.</h2>
            <span className="mono">In drei Schritten</span>
          </div>
          <div className="beat-grid">
            <article className="beat">
              <SceneCanvas scene="think" />
              <div className="beat-in">
                <span className="mono">Zuerst</span>
                <h3 className="verb">Verstehen</h3>
                <p>Ich frage nach, höre zu und will wissen, wie es wirklich läuft.</p>
              </div>
            </article>
            <article className="beat">
              <SceneCanvas scene="build" />
              <div className="beat-in">
                <span className="mono">Dann</span>
                <h3 className="verb">Bauen</h3>
                <p>Ich programmiere die Lösung, vom kleinen Tool bis zum ganzen System.</p>
              </div>
            </article>
            <article className="beat">
              <SceneCanvas scene="create" />
              <div className="beat-in">
                <span className="mono">Zum Schluss</span>
                <h3 className="verb">Gestalten</h3>
                <p>Es bekommt einen Namen, ein Gesicht und einen Auftritt.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="ticker" aria-label="Was ich baue">
          <div className="ticker-track">
            <TickerRow />
            <TickerRow hidden />
          </div>
        </section>

        <section className="claim" aria-label="Haltung">
          <div className="wrap gut">
            <p>
              Ich mag gute Lösungen. <b>Und ich frage gern, ob es noch eine bessere gibt.</b>
            </p>
            <p className="ai-note">
              KI gehört heute dazu, wo sie wirklich hilft. Für Unternehmen setze ich das mit{" "}
              <a href="https://8gent.tech" target="_blank" rel="noopener">
                8gent
              </a>{" "}
              um.
            </p>
          </div>
        </section>

        <section className="brands wrap gut" id="idee" aria-label="Deine Idee">
          <a className="brand-card idea-card" href="#kontakt">
            <SceneCanvas scene="seed" />
            <span className="mono">Deine Idee</span>
            <div className="go">
              <div style={{ display: "grid", gap: 16 }}>
                <span className="name">Die nächste Idee wartet schon.</span>
                <p>Du hast etwas im Kopf, das wachsen soll? Lass uns darüber reden.</p>
              </div>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </div>
          </a>
        </section>

        <section className="person" id="person" aria-label="Person">
          <SceneCanvas scene="topo" />
          <div className="person-in wrap gut">
            <figure className="photo">
              <Image
                src="/portrait.jpg"
                alt="Mathias Fröhlich lehnt lächelnd an einem Holzzaun auf einer Alpe"
                width={900}
                height={1117}
                sizes="(max-width: 860px) calc(100vw - 32px), 440px"
              />
              <figcaption className="mono">Auf einer Alpe im Allgäu</figcaption>
            </figure>
            <div>
              <span className="mono">Dahinter</span>
              <h2 style={{ marginTop: 14 }}>
                Mathias Fröhlich. <span>Freigeist.</span>
              </h2>
              <p style={{ marginTop: 22, fontSize: "clamp(18px,1.8vw,21px)", maxWidth: "36ch", color: "var(--bone)" }}>
                Ich schaue hin, hinterfrage und gestalte.
              </p>
              <div className="tags">
                <span>Denker</span>
                <span>Konzepter</span>
                <span>Gestalter</span>
                <span>Entwickler</span>
                <span>Autor</span>
                <span>Gründer</span>
              </div>
              <p className="mono coord">47.55° N · 10.63° O · Vils, Tirol</p>
            </div>
          </div>
        </section>

        <section className="kontakt" id="kontakt" aria-label="Kontakt">
          <SceneCanvas scene="ping" />
          <div className="kontakt-in wrap gut">
            <div className="k-text">
              <span className="mono">Kontakt</span>
              <h2>
                Neugierig? <span>Gut so.</span>
              </h2>
              <p>Erzähl mir, was dir im Kopf herumgeht. Ich melde mich.</p>
            </div>
            <CopyPlates />
          </div>
        </section>
      </main>

      <section className="legal wrap gut" aria-label="Rechtliches">
        <details id="impressum">
          <summary>Impressum</summary>
          <div className="txt">
            <p>
              <b>Angaben gemäß § 5 DDG</b>
            </p>
            <p>
              Mathias Fröhlich
              <br />
              byFröhlich
              <br />
              Lußwiesen 2b
              <br />
              87547 Missen-Wilhams
              <br />
              Deutschland
            </p>
            <p>
              <b>Kontakt</b>
              <br />
              E-Mail: kontakt@byfroehlich.de
              <br />
              Telefon: +49 179 9042777
            </p>
            <p>
              <b>Umsatzsteuer</b>
              <br />
              Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer ausgewiesen.
            </p>
            <p>
              <b>Verbraucherstreitbeilegung</b>
              <br />
              Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </details>
        <details id="datenschutz">
          <summary>Datenschutz</summary>
          <div className="txt">
            <p>
              <b>Verantwortlicher</b>
              <br />
              Mathias Fröhlich, byFröhlich, Lußwiesen 2b, 87547 Missen-Wilhams, Deutschland
              <br />
              kontakt@byfroehlich.de · +49 179 9042777
            </p>
            <p>
              <b>Hosting</b>
              <br />
              Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet. Beim Aufruf der Seite verarbeitet Vercel
              technisch notwendige Daten wie IP-Adresse, Zeitpunkt des Abrufs, aufgerufene Seite und Browser-Informationen, um die Seite auszuliefern und
              vor Missbrauch zu schützen. Rechtsgrundlage ist mein berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f
              DSGVO). Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert; die Übermittlung in die USA stützt sich auf den
              Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO). Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung.
            </p>
            <p>
              <b>Kontakt per E-Mail oder Telefon</b>
              <br />
              Wenn du mich kontaktierst, verarbeite ich deine Angaben, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b oder f DSGVO). Die Daten
              lösche ich, sobald sie dafür nicht mehr nötig sind und keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
            <p>
              <b>Cookies und Tracking</b>
              <br />
              Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste. Schriften werden vom eigenen Server geladen.
            </p>
            <p>
              <b>Deine Rechte</b>
              <br />
              Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15 bis
              21 DSGVO). Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel beim Bayerischen Landesamt für
              Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.
            </p>
            <p>
              <b>Stand</b>
              <br />
              Oktober 2026
            </p>
          </div>
        </details>
      </section>

      <footer className="wrap gut">
        <span className="mono">© byFröhlich</span>
        <span>
          <LegalLink id="impressum">Impressum</LegalLink>
          <LegalLink id="datenschutz">Datenschutz</LegalLink>
        </span>
      </footer>
      <OpenFromHash />
    </>
  );
}
