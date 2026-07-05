import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCsvParser } from './useCsvParser';

describe('useCsvParser', () => {
  const createMockFile = (content: string, name: string = 'test.csv', size?: number) => {
    const file = new File([content], name, { type: 'text/csv' });
    if (size) {
      Object.defineProperty(file, 'size', { value: size });
    }
    return file;
  };

  it('初期状態が正しいこと', () => {
    const { result } = renderHook(() => useCsvParser());
    expect(result.current.isParsing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.parsedData).toBeNull();
  });

  it('正しいCSVファイルをパースできること', async () => {
    const { result } = renderHook(() => useCsvParser());
    
    const csvContent = "氏名,メールアドレス\n山田 太郎,yamada@example.com\n鈴木 一郎,suzuki@example.com";
    const file = createMockFile(csvContent);

    await act(async () => {
      await result.current.parseCsv(file);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.parsedData).toHaveLength(2);
    expect(result.current.parsedData?.[0]).toEqual({
      name: '山田 太郎',
      email: 'yamada@example.com'
    });
  });

  it('5MBを超えるファイルはエラーになること', async () => {
    const { result } = renderHook(() => useCsvParser());
    
    // 5MB + 1byte のファイル
    const file = createMockFile('dummy', 'test.csv', 5 * 1024 * 1024 + 1);

    await act(async () => {
      await result.current.parseCsv(file);
    });

    expect(result.current.error).toBe('ファイルサイズは5MB以下にしてください。');
    expect(result.current.parsedData).toBeNull();
  });

  it('.csv以外のファイルはエラーになること', async () => {
    const { result } = renderHook(() => useCsvParser());
    
    const file = createMockFile('dummy', 'test.txt');

    await act(async () => {
      await result.current.parseCsv(file);
    });

    expect(result.current.error).toBe('CSVファイルを選択してください。');
    expect(result.current.parsedData).toBeNull();
  });

  it('空のファイルはエラーになること', async () => {
    const { result } = renderHook(() => useCsvParser());
    
    const file = createMockFile('');

    await act(async () => {
      await result.current.parseCsv(file);
    });

    expect(result.current.error).toBe('ファイルが空です。');
    expect(result.current.parsedData).toBeNull();
  });

  it('列が足りない行がある場合はエラーになること', async () => {
    const { result } = renderHook(() => useCsvParser());
    
    // メールアドレスが欠落
    const csvContent = "氏名,メールアドレス\n山田 太郎";
    const file = createMockFile(csvContent);

    await act(async () => {
      await result.current.parseCsv(file);
    });

    expect(result.current.error).toContain('フォーマットが正しくありません');
    expect(result.current.parsedData).toBeNull();
  });
});
