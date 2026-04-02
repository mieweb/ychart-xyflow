import { createRoot } from 'react-dom/client';
import { YChart, type YChartProps } from './index';

export type MountOptions = YChartProps;

/**
 * Imperative mount API for non-React consumers.
 * Usage: YChartXYFlow.mount('#container', { data: yamlString })
 */
export function mount(
  container: string | HTMLElement,
  options: MountOptions
): { unmount: () => void; update: (newOptions: Partial<MountOptions>) => void } {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) throw new Error(`Container not found: ${container}`);

  const root = createRoot(el as HTMLElement);
  let currentOptions = { ...options };

  function render(opts: MountOptions) {
    root.render(<YChart {...opts} />);
  }

  render(currentOptions);

  return {
    unmount: () => root.unmount(),
    update: (newOptions) => {
      currentOptions = { ...currentOptions, ...newOptions };
      render(currentOptions);
    },
  };
}
