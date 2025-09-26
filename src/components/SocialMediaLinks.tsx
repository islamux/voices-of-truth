import React from "react";
import { FaTwitter, FaYoutube, FaFacebook, FaInstagram, FaTelegram, FaLink } from "react-icons/fa";
import {  IconContext } from "react-icons";
import { Scholar } from "@/types";

interface SocialMediaLinksProps{
  socialMedia: Scholar['socialMedia'];
  name: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  socialMedia,name }) => {

    const renderSocialIcon = (platform: string, link: string, icon?: string) => {
      let iconElement;
      switch(icon){
        case 'FaTwitter' : iconElement = <FaTwitter/>; break;
        case 'FaYoutube' : iconElement = <FaYoutube/>; break;
        case 'FaFacebook' : iconElement = <FaFacebook/>; break;
        case 'FaInstagram' : iconElement = <FaInstagram/>; break;
        case 'FaTelegram' : iconElement = <FaTelegram/>; break;
        default: iconElement = <FaLink/>;
      }
      return (
        <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[rgb(var(--muted-text-rgb))] hover:text-[rgb(var(--foreground-rgb))] transition-colors mx-2"
        aria-label={`${platform} link for ${name}`}
        key={link}
      >
        <IconContext.Provider value={{size: "1.5em"}}>
        {iconElement}
        </IconContext.Provider>
        <span className="sr-only">{platform}</span>
        </a>
      );
    };


    return(
      <div className="mt-auto pt-3 border-t border-[rgb(var(--card-border-rgb))] w-full flex justify-center items-center">
      {socialMedia.map( (social)=>
        renderSocialIcon(social.platform, social.link, social.icon)
      )}
      </div>
    );
  };
export default SocialMediaLinks;
