import React from 'react';
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
import { Scholar } from '@/types';

interface SocialMediaLinksProps {
  socialMedia: Scholar['socialMedia'];
  name: string;
}

export default function SocialMediaLinks({
  socialMedia,
  name,
}: SocialMediaLinksProps) {
  const renderSocialIcon = (platform: string, link: string, icon?: string) => {
    let iconElement;
    switch (icon) {
      case 'FaTwitter':
        iconElement = <FaTwitter />;
        break;
      case 'FaYoutube':
        iconElement = <FaYoutube />;
        break;
      case 'FaFacebook':
        iconElement = <FaFacebook />;
        break;
      case 'FaInstagram':
        iconElement = <FaInstagram />;
        break;
      case 'FaTelegram':
        iconElement = <FaTelegram />;
        break;
      case 'FaTiktok':
        iconElement = <FaTiktok />;
        break;
      case 'FaGlobe':
        iconElement = <FaGlobe />;
        break;
      case 'SiPatreon':
        iconElement = <SiPatreon />;
        break;
      case 'FaPaypal':
        iconElement = <FaPaypal />;
        break;
      case 'FaApple':
        iconElement = <FaApple />;
        break;
      case 'FaSoundcloud':
        iconElement = <FaSoundcloud />;
        break;
      case 'FaAndroid':
        iconElement = <FaAndroid />;
        break;
      case 'FaLinkedin':
        iconElement = <FaLinkedin />;
        break;
      case 'FaWhatsapp':
        iconElement = <FaWhatsapp />;
        break;
      default:
        iconElement = <FaLink />;
    }
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-base text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
        aria-label={`${platform} link for ${name}`}
        key={link}
      >
        {iconElement}
        <span className="sr-only">{platform}</span>
      </a>
    );
  };

  return (
    <div className="mt-auto w-full border-t border-border pt-3">
      <div className="flex flex-wrap justify-center gap-1">
        {socialMedia.map((social) =>
          renderSocialIcon(social.platform, social.link, social.icon),
        )}
      </div>
    </div>
  );
}
