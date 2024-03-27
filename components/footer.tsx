import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "../constants/index.js"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { title as CustomTitle, subtitle as subtitle } from "@/components/primitives";

const Footer = () => {
    return (
        <footer className="flex flex-1  justify-center p-10">
            <div>
                <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                    {FOOTER_CONTACT_INFO.links.map((link) => (
                        <Link
                            href={link.label === 'Email' ? `mailto:${link.value}` : link.label === 'Phone' ? `tel:${link.value}` : '/'}
                            key={link.label}
                            className="flex flex-col"
                        >
                            <p className={"text-lg"}>
                                {link.label}
                            </p>
                            <p className={"text-sm"}>
                                {link.value}
                            </p>

                        </Link>
                    ))}
                </FooterColumn>
            </div>

            <div className="flex flex-col ml-16">
                <FooterColumn title={SOCIALS.title}>
                    <ul className="regular-14 flex gap-4 text-gray-30">
                        {SOCIALS.links.map((item) => (
                            <Link href={item.link} key={item.link} target="_blank" rel="noopener noreferrer">
                                <div className="flex-row flex">
                                    <Image
                                        color="white"
                                        src={item.icon}
                                        alt="logo"
                                        width={24}
                                        height={24}
                                    ></Image>
                                    <p className="text-sm">@{item.link}</p> </div>

                            </Link>
                        ))}
                    </ul>
                </FooterColumn>
            </div>

        </footer>
    );
};
type FooterColumnProps = {
    title: string;
    children: React.ReactNode;
};
const FooterColumn = ({ title, children }: FooterColumnProps) => {
    return (
        <div className="flex flex-col">
            <h2 className={subtitle()}>
                {title}
            </h2>
            <h1 className={CustomTitle()}>{children}&nbsp;</h1>
        </div>
    );
};

export default Footer;
