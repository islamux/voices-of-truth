import {
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaLink,
  FaTiktok,
  FaGlobe,
  FaPaypal,
  FaApple,
  FaSoundcloud,
  FaAndroid,
  FaLinkedin,
  FaWhatsapp,
} from 'react-icons/fa';
import { SiPatreon } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { Scholar } from '@/types';

const ICON_BY_NAME: Record<string, IconType> = {
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaGlobe,
  SiPatreon,
  FaPaypal,
  FaApple,
  FaSoundcloud,
  FaAndroid,
  FaLinkedin,
  FaWhatsapp,
};

const DEFAULT_ICON: IconType = FaLink;

interface SocialMediaLinksProps {
  socialMedia: Scholar['socialMedia'];
  name: string;
}

export default function SocialMediaLinks({
  socialMedia,
  name,
}: SocialMediaLinksProps) {
  return (
    <div className="mt-auto w-full border-t border-border pt-3">
      <div className="flex flex-wrap justify-center gap-1">
        {socialMedia.map((social) => {
          const Icon = ICON_BY_NAME[social.icon ?? ''] ?? DEFAULT_ICON;
          return (
            <a
              key={social.link}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-base text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              aria-label={`${social.platform} link for ${name}`}
            >
              <Icon />
              <span className="sr-only">{social.platform}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
