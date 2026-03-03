/**
 * Disposable email detection utility.
 *
 * Strategy:
 *   1. Fast offline check against a hardcoded Set of known disposable domains.
 *   2. If not in the list, query mailcheck.ai with a 4-second timeout.
 *   3. On any API failure, fail open (return false) to avoid blocking legitimate users.
 */

const DISPOSABLE_DOMAINS = new Set([
  // Guerrilla Mail family
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'guerrillamailblock.com', 'grr.la', 'sharklasers.com', 'spam4.me',
  // Mailinator family
  'mailinator.com',
  // TempMail / TrashMail
  'tempmail.com', 'temp-mail.org', 'throwam.com',
  'trashmail.com', 'trashmail.at', 'trashmail.io', 'trashmail.me', 'trashmail.net',
  'trash-mail.at', 'trashdevil.com', 'trashdevil.de', 'trashemail.de',
  // YOPmail family
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf',
  'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
  // Discard / Maildrop
  'discard.email', 'maildrop.cc', 'mailnull.com', 'mailnesia.com',
  'dispostable.com', 'fakeinbox.com', 'mailforspam.com',
  // SpamGourmet
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  // SpamFree24 family
  'spamfree24.org', 'spamfree24.de', 'spamfree24.eu',
  'spamfree24.info', 'spamfree24.net', 'spamfree.eu',
  // Misc
  'owlpic.com', 'spambox.us', 'tempinbox.com', 'tempinbox.co.uk',
  'filzmail.com', 'spamhole.com', 'tempr.email', 'deadaddress.com',
  'mailexpire.com', 'mailfreeonline.com', 'mailscrap.com',
  'mailsiphon.com', 'mailzilla.org', 'no-spam.ws', 'spamavert.com',
  'spamgob.com', 'spamherelots.com', 'spamhereplease.com',
  'spaml.de', 'spamoff.de', 'spamspot.com', 'spamthis.co.uk',
  'spamtroll.net', 'temporaryemail.net', 'tempsky.com',
  'getonemail.com', 'getonemail.net',
])

function extractDomain(email: string): string | null {
  const parts = email.trim().toLowerCase().split('@')
  if (parts.length !== 2 || !parts[1]) return null
  return parts[1]
}

async function checkMailcheckApi(email: string): Promise<boolean | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)
  try {
    const response = await fetch(
      `https://api.mailcheck.ai/email/${encodeURIComponent(email)}`,
      { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/json' } }
    )
    if (!response.ok) return null
    const data = await response.json()
    return data.disposable === true
  } catch {
    // AbortError (timeout) o cualquier error de red → fail open
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Returns true if the email belongs to a known disposable/temporary service.
 * Fails open (returns false) if the API is unavailable.
 */
export async function isDisposableEmail(email: string): Promise<boolean> {
  const domain = extractDomain(email)
  if (!domain) return false
  if (DISPOSABLE_DOMAINS.has(domain)) return true
  const apiResult = await checkMailcheckApi(email)
  return apiResult === true
}
