import { createRouter, createWebHistory } from "vue-router";

import { useOnboard } from "./composables/useOnboard";
import About from "./components/About.vue";
import Home from "./components/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
  ],
});

const hasRecentlyConnected = (previousTimestamp: number, maxMinutes = 6) => {
  const timestamp = Date.now();
  const minutes = Math.floor((timestamp - previousTimestamp) / 60000);
  return minutes < maxMinutes;
}

router.beforeEach(async (_, _2, next) => {
  const {
    alreadyConnectedWallets,
    connectedWallet,
    lastConnectionTimestamp,
    connectWallet,
  } = useOnboard();

  if (connectedWallet.value === null && alreadyConnectedWallets.value.length > 0 && hasRecentlyConnected(lastConnectionTimestamp.value)) {
    await connectWallet({
      autoSelect: {
        label: alreadyConnectedWallets.value[0],
        disableModals: true,
      },
    });
  }
  next();
});

export default router;
