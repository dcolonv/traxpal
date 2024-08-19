import { CallToAction } from '@/components/root/CallToAction';
import { Faqs } from '@/components/root/Faqs';
import { Footer } from '@/components/root/Footer';
import { Header } from '@/components/root/Header';
import { Hero } from '@/components/root/Hero';
import { Pricing } from '@/components/root/Pricing';
import { PrimaryFeatures } from '@/components/root/PrimaryFeatures';
import { SecondaryFeatures } from '@/components/root/SecondaryFeatures';
import { Testimonials } from '@/components/root/Testimonials';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
