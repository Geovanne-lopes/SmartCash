package br.com.fiap.fintech.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "T_SMC_USUARIO")
@SequenceGenerator(
        name = "SEQ_USUARIO",
        sequenceName = "SEQ_USUARIO",
        allocationSize = 1
)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_USUARIO")
    @Column(name = "ID_USUARIO")
    private Long id;

    @Email
    @NotBlank(message = "O e-mail é obrigatório")
    @Column(name = "DS_EMAIL", nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve conter pelo menos 8 caracteres")
    @Column(name = "DS_HASH_SENHA", nullable = false, length = 255)
    private String senhaHash;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "NM_USUARIO", nullable = false, length = 100)
    private String nome;

    public Usuario() {}

    public Usuario(String nome, String email, String senhaHash) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
}
