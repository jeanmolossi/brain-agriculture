import {
  refine,
  string,
  object,
  integer,
  array,
  enums,
  min,
  nonempty,
} from "superstruct";
import { farmingsEnum } from "@/types/entities";

const document = refine(string(), "document", (value) => {
  value = value.replace(/[.-\s\/]+/g, "");
  const hasCorrectLength = value.length === 11 || value.length === 14;
  return hasCorrectLength && (validateCPF(value) || validateCNPJ(value));
});

const farmings = enums(farmingsEnum);

const farmingSchema = object({
  type: farmings,
  area: min(integer(), 0),
});

const farmerSchema = object({
  name: string(),
  farm_name: string(),
  document: document,
  city: string(),
  state: string(),
  farm_total_area: min(integer(), 0),
  farm_usable_area: min(integer(), 0),
  farmings: nonempty(array(farmingSchema)),
});

function validateCPF(cpf: string) {
  let sum = 0;
  let remaining: number;

  if (cpf == "00000000000") return false;
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remaining = (sum * 10) % 11;

  if (remaining == 10 || remaining == 11) remaining = 0;
  if (remaining != parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remaining = (sum * 10) % 11;

  if (remaining == 10 || remaining == 11) remaining = 0;
  if (remaining != parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function validateCNPJ(cnpj: string) {
  var b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  var c: any = String(cnpj).replace(/[^\d]/g, "");

  if (c.length !== 14) return false;

  if (/0{14}/.test(c)) return false;

  for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
  if (c[12] != ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
  if (c[13] != ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  return true;
}

export default farmerSchema;
