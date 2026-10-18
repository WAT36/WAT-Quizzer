import React, { useState } from 'react';
import { Autocomplete, Chip, FormControl, TextField, ToggleButton } from '@mui/material';
import { PullDownOptionDto } from 'quizzer-lib';

// カテゴリ検索条件（複数指定はAND検索。NOTを指定したカテゴリは「含まない」）
export interface CategoryConditionValue {
  category_and?: string[];
  category_not?: string[];
}

interface CategoryConditionInputProps {
  optionList: PullDownOptionDto[];
  value: CategoryConditionValue;
  onChange: (value: Required<CategoryConditionValue>) => void;
  label?: string;
}

export const CategoryConditionInput = ({ optionList, value, onChange, label }: CategoryConditionInputProps) => {
  const notCategories = value.category_not ?? [];
  const selectedCategories = [...(value.category_and ?? []), ...notCategories];
  const isNot = (category: string) => notCategories.includes(category);

  // NOTを切り替えても並びが変わらないよう、選択した順番を保持する
  const [order, setOrder] = useState<string[]>([]);
  const orderedCategories = [
    ...order.filter((c) => selectedCategories.includes(c)),
    ...selectedCategories.filter((c) => !order.includes(c))
  ];

  const emit = (categories: string[], isNotCategory: (category: string) => boolean) => {
    onChange({
      category_and: categories.filter((c) => !isNotCategory(c)),
      category_not: categories.filter((c) => isNotCategory(c))
    });
  };

  const toggleNot = (category: string) => {
    emit(orderedCategories, (c) => (c === category ? !isNot(c) : isNot(c)));
  };

  const selectedOptions = orderedCategories.map(
    (c) => optionList.find((opt) => String(opt.value) === c) ?? { value: c, label: c }
  );

  return (
    <FormControl sx={{ minWidth: 120, maxWidth: '100%' }}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        className="my-[8px]"
        options={optionList}
        value={selectedOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, val) => String(option.value) === String(val.value)}
        onChange={(_event, newValue) => {
          const newCategories = newValue.map((v) => String(v.value));
          setOrder(newCategories);
          // 新しく追加したカテゴリはNOTなし（含む）とする
          emit(newCategories, isNot);
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const category = String(option.value);
            const not = isNot(category);
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                {...tagProps}
                variant="outlined"
                color={not ? 'error' : 'primary'}
                sx={{
                  height: 'auto',
                  py: 0.25,
                  ...(not && { '& .category-name': { textDecoration: 'line-through' } })
                }}
                label={
                  <span className="flex items-center gap-1">
                    <ToggleButton
                      size="small"
                      value="NOT"
                      color="error"
                      selected={not}
                      aria-label={`${option.label}を含まない`}
                      // タグ内のクリックで候補リストが開かないようにする
                      onMouseDown={(e) => e.stopPropagation()}
                      onChange={() => toggleNot(category)}
                      sx={{ py: 0, px: 0.75, fontSize: '0.65rem', lineHeight: 1.6 }}
                    >
                      NOT
                    </ToggleButton>
                    <span className="category-name">{option.label}</span>
                  </span>
                }
              />
            );
          })
        }
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </FormControl>
  );
};
