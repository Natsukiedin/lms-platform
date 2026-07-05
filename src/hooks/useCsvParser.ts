import { useState } from 'react';

interface ParsedUser {
  name: string;
  email: string;
  password?: string;
}

export const useCsvParser = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedUser[] | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const parseCsv = async (file: File) => {
    setIsParsing(true);
    setError(null);
    setParsedData(null);

    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('ファイルサイズは5MB以下にしてください。');
      }

      if (!file.name.endsWith('.csv')) {
        throw new Error('CSVファイルを選択してください。');
      }

      const text = await file.text();
      // 簡単なCSVパース処理。実際にはpapa-parseなどを使用することが望ましいですが、要件を満たすために自前で実装します
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        throw new Error('ファイルが空です。');
      }

      // 1行目はヘッダーと仮定 ('氏名', 'メールアドレス'等)
      // ヘッダーがあるかどうかは簡単なチェックで判定。
      const firstLine = lines[0].split(',');
      const hasHeader = firstLine.some(col => col.includes('氏名') || col.includes('名') || col.includes('名前') || col.includes('メール'));
      
      const dataLines = hasHeader ? lines.slice(1) : lines;
      
      const users: ParsedUser[] = dataLines.map((line, index) => {
        const columns = line.split(',');
        if (columns.length < 2) {
          throw new Error(`${index + (hasHeader ? 2 : 1)}行目のフォーマットが正しくありません。`);
        }
        
        return {
          name: columns[0].trim().replace(/^"|"$/g, ''),
          email: columns[1].trim().replace(/^"|"$/g, ''),
          password: columns.length >= 3 ? columns[2].trim().replace(/^"|"$/g, '') : undefined,
        };
      });

      setParsedData(users);
      return users;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('CSVの解析中にエラーが発生しました。');
      }
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  return { parseCsv, isParsing, error, parsedData };
};
