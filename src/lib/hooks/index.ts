import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  register,
  login,
  confirmEmail,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getMe,
  logout,
} from "@/lib/api/user.api";
import { listFood, addFood, removeFood } from "@/lib/api/food.api";
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
} from "@/lib/api/cart.api";
import {
  placeOrder,
  verifyOrder,
  getUserOrders,
  adminGetAllOrders,
  adminUpdateOrderStatus,
} from "@/lib/api/order.api";
import { useAuthStore } from "@/lib/store/auth";
import type {
  LoginForm,
  RegisterForm,
  User,
  FoodItem,
  CartItem,
  Order,
  DeliveryAddress,
} from "@/types";

// ── Auth ──────────────────────────────────────────────────────────────────────

export function useRegister() {
  return useMutation({ mutationFn: (data: RegisterForm) => register(data) });
}

export function useLogin() {
  return useMutation({ mutationFn: (data: LoginForm) => login(data) });
}

export function useConfirmEmail() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => confirmEmail(data),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { email: string }) => resendOtp(data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data),
  });
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyResetOtp(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      confirmPassword: string;
    }) => resetPassword(data),
  });
}

export function useGetMe(): UseQueryResult<User> {
  const { refresh_Token } = useAuthStore();
  return useQuery({
    queryKey: ["me", refresh_Token],
    queryFn: ({ signal }) => getMe(signal),
    select: (data) => data.data.data.user as User,
    enabled: !!refresh_Token,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

// ── Food ──────────────────────────────────────────────────────────────────────

export function useGetFoods(): UseQueryResult<FoodItem[]> {
  return useQuery({
    queryKey: ["foods"],
    queryFn: ({ signal }) => listFood(signal),
    select: (data) => data.data.data as FoodItem[],
    staleTime: 1000 * 60 * 10,
  });
}

export function useAddFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => addFood(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });
}

export function useRemoveFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeFood(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export function useGetCart(): UseQueryResult<CartItem[]> {
  const { access_Token } = useAuthStore();
  return useQuery({
    queryKey: ["cart"],
    queryFn: ({ signal }) => getCart(signal),
    select: (data) => data.data.cartData as CartItem[],
    enabled: !!access_Token,
    staleTime: 1000 * 30,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => addToCart(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeFromCart(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartQuantity(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      items: CartItem[];
      amount: number;
      address: DeliveryAddress;
    }) => placeOrder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useVerifyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { orderId: string; success: string }) => verifyOrder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useGetUserOrders(): UseQueryResult<Order[]> {
  const { access_Token } = useAuthStore();
  return useQuery({
    queryKey: ["orders"],
    queryFn: ({ signal }) => getUserOrders(signal),
    select: (data) => data.data.data as Order[],
    enabled: !!access_Token,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAdminGetAllOrders(): UseQueryResult<Order[]> {
  const { access_Token } = useAuthStore();
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: ({ signal }) => adminGetAllOrders(signal),
    select: (data) => data.data.data as Order[],
    enabled: !!access_Token,
    refetchInterval: 30_000,
  });
}

export function useAdminUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { orderId: string; status: string }) =>
      adminUpdateOrderStatus(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
}
