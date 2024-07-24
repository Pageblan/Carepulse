"use client"


import { Control} from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input"
import { E164Number} from "libphonenumber-js/core"
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
  }

interface CustomProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: FormFieldType;
}

const RenderInput = ({field, props}: {field:any; props: CustomProps}) => {
    const {fieldType, placeholder, iconSrc, iconAlt, dateFormat, showTimeSelect, renderSkeleton, children, disabled, name, label} = props;
    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    height={24}
                    width={24}
                    alt={iconAlt || "icon"}
                    className="ml-2"
                  />
                )}
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    {...field}
                    className="shad-input border-0"
                  />
                </FormControl>
              </div>
            )
        case FormFieldType.TEXTAREA:
          return (
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      {...field}
                      className="shad-textArea"
                      disabled={disabled}
                    />
                </FormControl>
            )
        case FormFieldType.PHONE_INPUT:
            return (
              <FormControl>
                <PhoneInput
                  defaultCountry="KE"
                  placeholder={placeholder}
                  international
                  withCountryCallingCode
                  value={field.value as E164Number | undefined}
                  onChange={field.onChange}
                  className="input-phone"
                />
              </FormControl>
            )
        case FormFieldType.CHECKBOX:
            return (
              <FormControl>
                <div className="flex items-center gap-4 ">
                  <Checkbox
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label htmlFor={name} className="checkbox-label">
                    {label}
                  </label>
                </div>
              </FormControl>
            )
        case FormFieldType.DATE_PICKER:
          return (
              <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                      src="/assets/icons/calendar.svg"
                      height={24}
                      width={24}
                      alt="calendar"
                      className="ml-2"
                    />
                    <FormControl>
                      <ReactDatePicker
                          showTimeSelect={showTimeSelect ?? false}
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          timeInputLabel="Time:"
                          dateFormat={dateFormat ?? "dd/MM/yyyy"}
                          wrapperClassName="date-picker"
                          placeholderText={placeholder}
                        />
                      </FormControl>
                </div>
            )
        case FormFieldType.SELECT:
          return (
                  <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="shad-select-content">
                              {children}
                          </SelectContent>
                      </Select>
                </FormControl>
            )
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        default:
        break;
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, name, label} = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
        )}
    />
  )
}

export default CustomFormField