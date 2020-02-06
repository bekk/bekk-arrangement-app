import { getAudience, getIssuerDomain, getScopes } from './config';
import { useEffect, useLayoutEffect } from 'react';
const EmployeeIdClaimType = 'https://api.bekk.no/claims/employeeId';

function parseHash(hash: string): any {
  // tslint:disable-next-line:no-any
  const params: any = {};
  const hashes = hash.replace('#', '').split('&');
  for (const h of hashes) {
    const param = h.split('=');
    params[param[0]] = param[1];
  }
  return params;
}

function saveToken(token: string): void {
  try {
    localStorage.setItem('userToken', token);
  } catch (e) {
    alert(
      'Fikk ikke hentet ut userToken fra localStorage. Om du bruker safari i privat mode skru av dette for at siden skal laste :)'
    );
  }
}

export function getIdToken(): string {
  try {
    return localStorage.getItem('userToken') || '';
  } catch (e) {
    alert(
      'Fikk ikke hentet ut userToken fra localStorage. Om du bruker safari i privat mode skru av dette for at siden skal laste :)'
    );
    return '';
  }
}

function base64ToUtf8(str: string): string {
  return decodeURIComponent(window.atob(str));
}

function getClaimsFromToken(jwt: string): any {
  const encoded = jwt && jwt.split('.')[1];
  const jsonString = base64ToUtf8(encoded);
  return JSON.parse(jsonString);
}

function getApplicationRoot(): string {
  return window.location.origin;
}

function getCurrentState(): string {
  const state = window.location.href.replace(getApplicationRoot(), '');
  return encodeURIComponent(state);
}

function getAuth0Url(): string {
  const encodedCallback = encodeURIComponent(
    getApplicationRoot() + '/redirect'
  );
  const state = getCurrentState();
  const encodedScopes = encodeURIComponent(getScopes());
  return `https://${getIssuerDomain()}/authorize?client_id=${getAudience()}&response_type=token&redirect_uri=${encodedCallback}&scope=${encodedScopes}&state=${state}`;
}

function redirectToAuth0(): void {
  const url = getAuth0Url();
  window.location.replace(url);
}

function getStateFromHash(): string {
  const parameters = parseHash(window.location.hash);
  return decodeURIComponent(parameters.state);
}

function redirectToState(): void {
  const state = getStateFromHash();
  window.location.replace(getApplicationRoot() + state);
}

function hashIsPresent(): boolean {
  return !!window.location.hash;
}

function tryParseToken(): string | null {
  if (hashIsPresent()) {
    const parameters = parseHash(window.location.hash);
    return parameters.id_token;
  }
  return null;
}

function isExpired(jwt: string): boolean {
  const claims = getClaimsFromToken(jwt);
  const epochNow = new Date().getTime() / 1000;
  return claims.exp <= epochNow - 10;
}

function isInGroup(userGroups: string, allowedGroup: string): boolean {
  return userGroups.indexOf(allowedGroup) >= 0;
}

export function isAuthorized(): boolean {
  const userGroups = getClaimsFromToken(getIdToken()).groups;
  return isInGroup(userGroups, 'Alle');
}

export function isAuthenticated(): boolean {
  const userToken = getIdToken();
  if (userToken) {
    return !isExpired(userToken);
  }
  return false;
}

export function getEmployeeId(): any {
  if (!isAuthenticated()) {
    throw new Error('User is not authenticated!');
  }
  return getClaimsFromToken(getIdToken())[EmployeeIdClaimType];
}

export function getRoleClaims(): void {
  if (!isAuthenticated()) {
    throw new Error('User is not authenticated!');
  }
}

export function authenticateUser(): void {
  if (!isAuthenticated()) {
    redirectToAuth0();
  }
}

export function catchTokenFromAuth0AndSaveIt(): void {
  const token = tryParseToken();
  if (token) {
    saveToken(token);
    redirectToState();
  }
}

export function useAuthentication(): void {
  useEffect(() => {
    authenticateUser();
  }, []);
}

export function useAuth0Redirect(): void {
  useLayoutEffect(() => {
    catchTokenFromAuth0AndSaveIt();
  }, []);
}

export function hasPermission(permission: string): boolean {
  const permissions: string[] = getClaimsFromToken(getIdToken())[
    'https://api.bekk.no/claims/permission'
  ];
  return permissions.includes(permission);
}

export const readPermission = 'read:arrangement';
