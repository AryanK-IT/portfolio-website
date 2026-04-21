import { footer } from '../data/content';

export default function Footer() {
  return (
    <footer className="w-full py-8 text-center border-t border-white/10 mt-24">
      <p className="text-white/50 text-sm font-mono tracking-wide">
        {footer.copy}
      </p>
    </footer>
  );
}
