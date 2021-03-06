import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import { theme, ThemedMixin } from '@dojo/framework/core/mixins/Themed';
import Link from '@dojo/framework/routing/Link';

import * as c from '@blocklang/bootstrap-classes';
import * as css from './Header.m.css';

import messageBundle from '../nls/main';
import { baseUrl } from '../config';
import FontAwesomeIcon from '@blocklang/dojo-fontawesome/FontAwesomeIcon';

export interface HeaderProperties {
	routing: string;
	isAuthenticated: boolean;
	loggedUsername?: string;
	loggedAvatarUrl?: string;
	onLogout: (opts: object) => void;
}

@theme(css)
export default class Header extends ThemedMixin(I18nMixin(WidgetBase))<HeaderProperties> {
	private _localizedMessages = this.localizeBundle(messageBundle);

	// 用户未登录时显示
	private _unauthenticatedMenu() {
		const { messages } = this._localizedMessages;

		return [
			v('li', { key: 'li-0', classes: [c.nav_item] }, [
				v('a', { classes: [c.nav_link], href: `${baseUrl}/oauth2/authorization/github` }, [
					w(FontAwesomeIcon, { icon: ['fab', 'github'] }),
					` ${messages.loginGithub}`,
				]),
			]),
			v('li', { key: 'li-1', classes: [c.nav_item] }, [
				v('a', { classes: [c.nav_link], href: `${baseUrl}/oauth2/authorization/qq` }, [
					w(FontAwesomeIcon, { icon: ['fab', 'qq'] }),
					` ${messages.loginQq}`,
				]),
			]),
		];
	}

	// 用户已登录时显示
	private _authenticatedMenu() {
		const { loggedUsername, loggedAvatarUrl } = this.properties;
		const { messages } = this._localizedMessages;

		return [
			v('li', { key: 'li-0', classes: [c.nav_item] }, [
				w(Link, { to: 'new-repo', classes: [c.nav_link] }, [
					w(FontAwesomeIcon, { icon: 'plus' }),
					` ${messages.newRepository}`,
				]),
			]),
			v('li', { key: 'li-1', classes: [c.nav_item, c.dropdown] }, [
				v(
					'a',
					{
						classes: [c.dropdown_toggle, c.nav_item, c.nav_link],
						href: '#',
						'data-toggle': 'dropdown',
						id: 'dropdownUser',
						'aria-haspopup': true,
						'aria-expanded': false,
					},
					[v('img', { classes: [c.avatar], src: `${loggedAvatarUrl}`, width: 20, height: 20 })]
				),
				v('div', { classes: [css.menu, c.dropdown_menu], 'aria-labelledby': 'dropdownUser' }, [
					v('p', { classes: [c.ps_4, c.py_1, c.mb_0, c.text_muted] }, [v('strong', [`${loggedUsername}`])]),
					v('div', { classes: [c.dropdown_divider] }),
					w(Link, { to: 'profile', params: { user: `${loggedUsername}` }, classes: [c.dropdown_item] }, [
						w(FontAwesomeIcon, { icon: 'user', classes: [c.me_2] }),
						`${messages.userHome}`,
					]),
					v('div', { classes: [c.dropdown_divider] }),

					w(Link, { to: 'settings-profile', classes: [c.dropdown_item] }, [
						w(FontAwesomeIcon, { icon: 'cog', classes: [c.me_2] }),
						`${messages.userSetting}`,
					]),
					v(
						'a',
						{
							classes: [c.dropdown_item],
							href: `${baseUrl}/logout`,
							onclick: this._onLogout,
						},
						[w(FontAwesomeIcon, { icon: 'sign-out-alt', classes: [c.me_2] }), `${messages.logout}`]
					),
				]),
			]),
		];
	}

	protected render() {
		const { isAuthenticated, routing } = this.properties;

		// 如果是 view-repo-page 则不显示此部件
		if (routing === 'view-repo-page') {
			return;
		}

		const { messages } = this._localizedMessages;

		const rootClasses = [css.root, c.navbar, c.navbar_expand_lg, c.navbar_light, c.bg_light];

		let docsMenuActive = false;
		let marketplaceMenuActive = false;
		if (routing === 'docs') {
			docsMenuActive = true;
		} else if (routing === 'list-component-repo') {
			marketplaceMenuActive = true;
		}

		return v('nav', { classes: rootClasses }, [
			v('div', { classes: [c.container] }, [
				w(Link, { to: 'home', classes: [c.navbar_brand] }, [messages.blockLang]),
				v(
					'button',
					{
						classes: [c.navbar_toggler],
						type: 'button',
						'data-toggle': 'collapse',
						'data-target': '#navbarSupportedContent',
						'aria-controls': '#navbarSupportedContent',
						'aria-expanded': 'false',
						'aria-label': '收缩导航栏',
					},
					[v('span', { classes: [c.navbar_toggler_icon] })]
				),
				v('div', { classes: [c.collapse, c.navbar_collapse], id: 'navbarSupportedContent' }, [
					v('ul', { classes: [c.navbar_nav, c.me_auto] }, [
						v('li', { classes: [c.nav_item] }, [
							w(
								Link,
								{
									classes: [c.nav_link, marketplaceMenuActive ? c.active : null],
									to: 'list-component-repo',
								},
								['市场']
							),
						]),
						v('li', { classes: [c.nav_item] }, [
							w(
								Link,
								{
									classes: [c.nav_link, docsMenuActive ? c.active : null],
									to: 'docs',
									params: { fileName: 'getting-started' },
								},
								['教程']
							),
						]),
					]),
					v(
						'ul',
						{ classes: [c.navbar_nav, c.ms_auto] },
						isAuthenticated ? this._authenticatedMenu() : this._unauthenticatedMenu()
					),
				]),
			]),
		]);
	}

	private _onLogout() {
		this.properties.onLogout({});
	}
}
