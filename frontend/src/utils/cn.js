/**
 * Simple conditional classnames combiner
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
