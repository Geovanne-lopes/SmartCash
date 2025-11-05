package br.com.fiap.fintech.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "T_SMC_DESPESA")
public class Despesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "SEQ_DESPESA")
    @SequenceGenerator(name = "SEQ_DESPESA", sequenceName = "SEQ_DESPESA", allocationSize = 1)
    @Column(name = "id_despesa")
    private long id;

    @Column(length = 100, nullable = false)
    private int nome;

    @Column(length = 100, nullable = false)
    private String descricao;

    @Column(name = "vl_despesa")
    private double valor;

    @Column(name = "dt_despesa")
    private LocalDate data;

    @Column(length = 100, nullable = false)
    private String categoria;

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }

    public int getNome() {
        return nome;
    }
    public void setNome(int nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public double getValor() {
        return valor;
    }
    public void setValor(double valor) {
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }
    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}