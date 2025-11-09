import { messages } from "./messages.js";

export const rules = {
  user: {
    create: {
      name: [(value) => (!value?.trim() ? messages.user.nameRequired : null)],
      email: [(value) => (!value?.trim() ? messages.user.emailRequired : null)],
      password: [
        (value) => (!value?.trim() ? messages.user.passwordRequired : null),
      ],
      accessType: [
        (value) =>
          typeof value !== "number" ? messages.user.accessTypeRequired : null,
      ],
    },
    update: {
      name: [(value) => (!value?.trim() ? messages.user.nameRequired : null)],
      email: [(value) => (!value?.trim() ? messages.user.emailRequired : null)],
      accessType: [
        (value) =>
          typeof value !== "number" ? messages.user.accessTypeRequired : null,
      ],
    },
  },
  supplier: {
    create: {
      name: [
        (value) =>
          !value || value.trim().length < 3
            ? messages.supplier.nameRequired
            : null,
        (value) =>
          value.trim().length > 50 ? messages.supplier.nameTooBig : null,
        (value) =>
          !/^[A-Za-zÀ-ÿ0-9\s]+$/.test(value)
            ? messages.supplier.nameInvalid
            : null,
      ],
      telephone: [
        (value) =>
          !value?.trim() ? messages.supplier.telephoneRequired : null,
        (value) => {
          const tel = value.replace(/\D/g, "");

          tel.length < 10 || tel.length > 11
            ? messages.supplier.telephoneSize
            : null;
        },
      ],
      address: [
        (value) =>
          !value || value.trim().length < 5
            ? messages.supplier.addressRequired
            : null,
      ],
      cnpj: [(value) => (!value ? messages.supplier.cnpjRequired : null)],
    },
  },
  product: {
    create: {
      name: [
        (value) =>
          !value || value.trim().length < 3
            ? messages.product.nameRequired
            : null,
        (value) =>
          value.trim().length > 40 ? messages.product.nameTooShort : null,
        (value) =>
          !/^[A-Za-zÀ-ÿ0-9\s]+$/.test(value)
            ? messages.product.nameInvalid
            : null,
      ],
      description: [
        (value) =>
          !value || value.trim().length < 10
            ? messages.product.descriptionRequired
            : null,
        (value) =>
          value.trim().length > 60
            ? messages.product.descriptionTooShort
            : null,
      ],
      unitPrice: [
        (value) =>
          !value || isNaN(value) || Number(value) <= 0
            ? messages.product.unitPriceInvalid
            : null,
      ],
      categoryId: [
        (value) =>
          !value || value <= 0 ? messages.product.categoryIdRequired : null,
      ],
    },
  },
  category: {
    create: {
      name: [
        (value) =>
          !value || value.trim().length < 3
            ? messages.category.nameRequired
            : null,
        (value) =>
          value.trim().length > 20 ? messages.category.nameTooShort : null,
        (value) =>
          !/^[A-Za-zÀ-ÿ0-9\s]+$/.test(value)
            ? messages.category.nameInvalid
            : null,
      ],
      description: [
        (value) =>
          !value || value.trim().length < 10
            ? messages.category.descriptionRequired
            : null,
        (value) =>
          value.trim().length > 50
            ? messages.category.descriptionTooShort
            : null,
      ],
    },
  },
  batch: {
    create: {
      price: [
        (value) =>
          !value || value === 0 ? messages.batch.priceRequired : null,
        (value) => (value < 0 ? messages.batch.priceNegative : null),
      ],
      quantity: [
        (value) =>
          !value || value === 0 ? messages.batch.quantityNotNull : null,
      ],
      validity: [
        (value) => {
          let dataValida = true;
          const validadeDate = new Date(value);

          if (!value || isNaN(new Date(value).getTime())) {
            dataValida = false;
            return messages.batch.invalidDate;
          } else if (dataValida === true && validadeDate < new Date()) {
            return messages.batch.dateOnPast;
          }
          return null;
        },
      ],
      supplierId: [
        (value) =>
          !value || value === 0 ? messages.batch.supplierIdRequired : null,
      ],
    },
  },
  stockMovement: {
    create: {
      date: [
        async (value) => {
          const movimentoDate = new Date(value);
          if (!value || isNaN(movimentoDate.getTime())) {
            return messages.stockMovement.dateInvalid;
          }
          if (movimentoDate > new Date()) {
            return messages.stockMovement.dateFuture;
          }
          return null;
        },
      ],
      type: [
        (value) =>
          !value || !value.trim() ? messages.stockMovement.typeRequired : null,
      ],
      quantity: [
        (value) => (!value ? messages.stockMovement.quantityRequired : null),
        (value) => (value <= 0 ? messages.stockMovement.quantityInvalid : null),
      ],
      productId: [
        (value) => (!value ? messages.stockMovement.productIdRequired : null),
        /*async (value) => {
          if (value) {
            const productExist = await prisma.product.findUnique({
              where: { id: value }
            });
            if (!productExist) {
              return messages.stockMovement.productNotFound;
            }
          }
          return null;
        }*/
      ],
      userId: [
        (value) => (!value ? messages.stockMovement.userIdRequired : null),
        /*async (value) => {
          if (value) {
            const userExist = await prisma.user.findUnique({
              where: { id: value }
            });
            if (!userExist) {
              return messages.stockMovement.userNotFound;
            }
          }
          return null;
        }*/
      ],
    },
  },
};
