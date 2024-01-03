export interface AddBookDto {
  book_name: string;
}

export interface AddSayingDto {
  book_id: number;
  saying: string;
  explanation: string;
}
