<?php

namespace App\Models\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HasEncryptedFiles
{
    protected static function bootHasEncryptedFiles(): void
    {
        static::creating(function ($model) {
            if (! $model->encryption_key) {
                $model->encryption_key = encrypt(base64_encode(random_bytes(32)));
            }
        });
    }

    public function getFileEncryptionKey(): string
    {
        return base64_decode(decrypt($this->encryption_key));
    }

    public function storeEncrypted(UploadedFile $file, string $path): string
    {
        $contents = file_get_contents($file->getRealPath());
        $encrypted = $this->encryptFile($contents);

        $filename = $file->hashName();
        $fullPath = trim($path, '/').'/'.$filename;

        Storage::disk('s3')->put($fullPath, $encrypted);

        return $fullPath;
    }

    public function putEncrypted(string $path, string $contents): void
    {
        $encrypted = $this->encryptFile($contents);
        Storage::disk('s3')->put($path, $encrypted);
    }

    public function getEncrypted(string $path): string
    {
        $encrypted = Storage::disk('s3')->get($path);

        return $this->decryptFile($encrypted);
    }

    public function deleteEncrypted(string $path): void
    {
        Storage::disk('s3')->delete($path);
    }

    protected function encryptFile(string $data): string
    {
        $key = $this->getFileEncryptionKey();
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv.$encrypted);
    }

    protected function decryptFile(string $data): string
    {
        $key = $this->getFileEncryptionKey();
        $data = base64_decode($data);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);

        return openssl_decrypt($encrypted, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    }
}
