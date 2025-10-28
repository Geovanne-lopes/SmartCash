package br.com.fiap.fintech.exception;

public class ItemNaoEncontradoException extends RuntimeException {
    public ItemNaoEncontradoException(String message) {
        super("Item não encontrado: " + message);
    }
}