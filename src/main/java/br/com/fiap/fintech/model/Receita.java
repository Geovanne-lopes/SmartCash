package br.com.fiap.fintech.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "T_SMC_RECEITA")
public class Receita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "SEQ_RECEITA")
    @SequenceGenerator(name = "SEQ_RECEITA", sequenceName = "SEQ_RECEITA", allocationSize = 1)
    @Column(name = "id_receita")
    private long id;

    @Column(length = 100, nullable = false, name = "nm_receita")
    private String nome;

    @Column(length = 100, nullable = false, name = "ds_receita")
    private String descricao;

    @Column(name = "vl_receita")
    private double valor;

    @Column(name = "dt_receita")
    private LocalDate data;

    @Column(length = 100, nullable = false, name = "cat_receita")
    private String categoria;


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